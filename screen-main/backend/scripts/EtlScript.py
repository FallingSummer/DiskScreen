#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据加工脚本 (ETL)
从 4 张原始 .dat 文件抽取、转换、加载到 MySQL 结果表。
支持按小时汇总指标，并生成状态快照。
"""

import os
import sys
import pymysql
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional

# ------------------------------------------------------------
# 配置区
# ------------------------------------------------------------
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', '3306'))
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', 'password')
DB_NAME = os.getenv('DB_NAME', 'DataScreenDB')

DATA_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(DATA_DIR, '..', '..', '.uploads')

# 原始数据文件路径
HOST_DETAIL_PATH = os.path.join(UPLOADS_DIR, '21d91f16-be2e-4a01-9a3e-fcc882e92b3f_host_detail.dat')
MOD_DETAIL_PATH = os.path.join(UPLOADS_DIR, '7dcbd74c-8644-4fa9-b1c1-a431ef0e3e48_mod_detail.dat')
PREF_TSAR_PATH = os.path.join(UPLOADS_DIR, '744e42c5-d183-41b5-b00e-19cde965ce65_pref_tsar.dat')
DISK_TSAR_PATH = os.path.join(UPLOADS_DIR, '635f4d77-536c-4b31-9bb1-31fa6afe8278_disk_tsar.dat')


def get_db_connection() -> pymysql.Connection:
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor,
    )


def parse_host_detail() -> pd.DataFrame:
    df = pd.read_csv(HOST_DETAIL_PATH, sep='\t', encoding='utf-8')
    df.columns = [c.strip() for c in df.columns]
    return df


def parse_pref_tsar() -> pd.DataFrame:
    df = pd.read_csv(PREF_TSAR_PATH, sep='\t', encoding='utf-8')
    df.columns = [c.strip() for c in df.columns]
    df['ts'] = pd.to_datetime(df['ts'], unit='ms')
    df['StatHour'] = df['ts'].dt.floor('H')
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    return df


def parse_disk_tsar() -> pd.DataFrame:
    df = pd.read_csv(DISK_TSAR_PATH, sep='\t', encoding='utf-8')
    df.columns = [c.strip() for c in df.columns]
    df['ts'] = pd.to_datetime(df['ts'], unit='ms')
    df['StatHour'] = df['ts'].dt.floor('H')
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    # 提取磁盘名，如 sda_write -> sda
    df['DiskName'] = df['mod'].str.extract(r'^([a-z]+\d+)_')[0]
    df['DiskMetric'] = df['mod'].str.extract(r'^[a-z]+\d+_(.+)$')[0]
    return df


def transform_performance_hourly(pref_df: pd.DataFrame) -> pd.DataFrame:
    """生成 ServerPerformanceHourly 结果表数据"""
    pivot = pref_df.pivot_table(
        index=['HostId', 'StatHour'],
        columns='mod',
        values='value',
        aggfunc='mean',
    ).reset_index()

    def agg_max(group: pd.DataFrame, col: str) -> pd.Series:
        return group.groupby(['HostId', 'StatHour'])[col].max()

    max_cpu = pref_df.groupby(['HostId', 'StatHour'])['cpu_usage'].max().reset_index()
    max_cpu = max_cpu.rename(columns={'cpu_usage': 'CpuUsageMax'})

    pivot = pivot.merge(max_cpu, on=['HostId', 'StatHour'], how='left')

    rename_map = {
        'cpu_usage': 'CpuUsageAvg',
        'cpu_idle': 'CpuIdleAvg',
        'mem_used': 'MemUsedAvg',
        'mem_free': 'MemFreeAvg',
        'mem_cache': 'MemCacheAvg',
        'load1': 'Load1Avg',
        'load5': 'Load5Avg',
        'load15': 'Load15Avg',
        'proc_run': 'ProcRunAvg',
        'proc_block': 'ProcBlockAvg',
        'proc_total': 'ProcTotalAvg',
    }
    pivot = pivot.rename(columns=rename_map)
    for col in rename_map.values():
        if col not in pivot.columns:
            pivot[col] = 0.0
    if 'CpuUsageMax' not in pivot.columns:
        pivot['CpuUsageMax'] = 0.0

    pivot['CpuUsageAvg'] = pivot.get('CpuUsageAvg', 0).fillna(0)
    pivot['CpuUsageMax'] = pivot.get('CpuUsageMax', 0).fillna(0)
    pivot['CpuIdleAvg'] = pivot.get('CpuIdleAvg', 0).fillna(0)
    pivot['MemUsedAvg'] = pivot.get('MemUsedAvg', 0).fillna(0)
    pivot['MemFreeAvg'] = pivot.get('MemFreeAvg', 0).fillna(0)
    pivot['MemCacheAvg'] = pivot.get('MemCacheAvg', 0).fillna(0)
    pivot['Load1Avg'] = pivot.get('Load1Avg', 0).fillna(0)
    pivot['Load5Avg'] = pivot.get('Load5Avg', 0).fillna(0)
    pivot['Load15Avg'] = pivot.get('Load15Avg', 0).fillna(0)
    pivot['ProcRunAvg'] = pivot.get('ProcRunAvg', 0).fillna(0).astype(int)
    pivot['ProcBlockAvg'] = pivot.get('ProcBlockAvg', 0).fillna(0).astype(int)
    pivot['ProcTotalAvg'] = pivot.get('ProcTotalAvg', 0).fillna(0).astype(int)

    return pivot[['HostId', 'StatHour', 'CpuUsageAvg', 'CpuUsageMax', 'CpuIdleAvg',
                  'MemUsedAvg', 'MemFreeAvg', 'MemCacheAvg',
                  'Load1Avg', 'Load5Avg', 'Load15Avg',
                  'ProcRunAvg', 'ProcBlockAvg', 'ProcTotalAvg']]


def transform_disk_hourly(disk_df: pd.DataFrame) -> pd.DataFrame:
    """生成 DiskPerformanceHourly 结果表数据"""
    df = disk_df.copy()
    # 按 DiskMetric 聚合
    metric_map = {
        'read': 'ReadAvg',
        'write': 'WriteAvg',
        'rqm': 'RqmAvg',
        'util': 'UtilAvg',
        'await': 'AwaitAvg',
        'svctm': 'SvctmAvg',
        'avgrq': 'AvgrqAvg',
    }
    results = []
    for metric, col_name in metric_map.items():
        sub = df[df['DiskMetric'] == metric].copy()
        if sub.empty:
            continue
        agg = sub.groupby(['HostId', 'StatHour', 'DiskName'])['value'].mean().reset_index()
        agg = agg.rename(columns={'value': col_name})
        results.append(agg)

    if not results:
        return pd.DataFrame(columns=['HostId', 'StatHour', 'DiskName', 'ReadAvg', 'WriteAvg',
                                     'RqmAvg', 'UtilAvg', 'AwaitAvg', 'SvctmAvg', 'AvgrqAvg'])

    merged = results[0]
    for r in results[1:]:
        merged = merged.merge(r, on=['HostId', 'StatHour', 'DiskName'], how='outer')

    for col in ['ReadAvg', 'WriteAvg', 'RqmAvg', 'UtilAvg', 'AwaitAvg', 'SvctmAvg', 'AvgrqAvg']:
        if col not in merged.columns:
            merged[col] = 0.0
        merged[col] = merged[col].fillna(0)

    return merged[['HostId', 'StatHour', 'DiskName', 'ReadAvg', 'WriteAvg',
                   'RqmAvg', 'UtilAvg', 'AwaitAvg', 'SvctmAvg', 'AvgrqAvg']]


def transform_network_hourly(pref_df: pd.DataFrame) -> pd.DataFrame:
    """生成 NetworkTrafficHourly 结果表数据"""
    net_mods = ['net_in', 'net_out', 'net_pktin', 'net_pktout']
    sub = pref_df[pref_df['mod'].isin(net_mods)].copy()
    pivot = sub.pivot_table(
        index=['HostId', 'StatHour'],
        columns='mod',
        values='value',
        aggfunc='mean',
    ).reset_index()

    rename_map = {
        'net_in': 'NetInAvg',
        'net_out': 'NetOutAvg',
        'net_pktin': 'NetPktInAvg',
        'net_pktout': 'NetPktOutAvg',
    }
    pivot = pivot.rename(columns=rename_map)
    for col in rename_map.values():
        if col not in pivot.columns:
            pivot[col] = 0.0
        pivot[col] = pivot[col].fillna(0)

    return pivot[['HostId', 'StatHour', 'NetInAvg', 'NetOutAvg', 'NetPktInAvg', 'NetPktOutAvg']]


def transform_status_snapshot(pref_df: pd.DataFrame, host_df: pd.DataFrame) -> pd.DataFrame:
    """生成 ServerStatusSnapshot 结果表数据（取每个 host 最新一小时的平均值）"""
    latest_hour = pref_df['StatHour'].max()
    latest = pref_df[pref_df['StatHour'] == latest_hour].copy()

    pivot = latest.pivot_table(
        index='HostId',
        columns='mod',
        values='value',
        aggfunc='mean',
    ).reset_index()

    rename_map = {
        'cpu_usage': 'CpuUsage',
        'mem_used': 'MemUsed',
        'mem_free': 'MemFree',
        'net_in': 'NetIn',
        'net_out': 'NetOut',
        'load1': 'Load1',
        'proc_run': 'ProcRun',
    }
    pivot = pivot.rename(columns=rename_map)
    for col in rename_map.values():
        if col not in pivot.columns:
            pivot[col] = 0.0
        pivot[col] = pivot[col].fillna(0)

    # 估算内存总量
    pivot['MemTotal'] = pivot.get('MemUsed', 0) + pivot.get('MemFree', 0)

    # 告警级别判定
    def alert_level(row: pd.Series) -> str:
        cpu = row.get('CpuUsage', 0)
        load = row.get('Load1', 0)
        if cpu > 80 or load > 15:
            return 'Critical'
        if cpu > 60 or load > 10:
            return 'Warning'
        return 'Normal'

    pivot['AlertLevel'] = pivot.apply(alert_level, axis=1)
    pivot['UpdateTime'] = latest_hour

    # 合并主机信息
    pivot = pivot.merge(host_df, on='HostId', how='left')
    pivot['HostName'] = pivot.get('hostname', pivot['HostId'])
    pivot['Model'] = pivot.get('model', '')
    pivot['Location1'] = pivot.get('location1', '')
    pivot['Location2'] = pivot.get('location2', '')

    return pivot[['HostId', 'HostName', 'Model', 'Location1', 'Location2',
                  'CpuUsage', 'MemUsed', 'MemTotal', 'NetIn', 'NetOut',
                  'Load1', 'ProcRun', 'AlertLevel', 'UpdateTime']]


def load_to_mysql(df: pd.DataFrame, table_name: str, conn: pymysql.Connection):
    """使用 REPLACE INTO 加载数据到 MySQL，利用唯一键防止重复"""
    if df.empty:
        print(f'[WARN] DataFrame is empty, skipping table {table_name}')
        return

    columns = df.columns.tolist()
    placeholders = ', '.join(['%s'] * len(columns))
    col_names = ', '.join([f'`{c}`' for c in columns])

    sql = f"REPLACE INTO `{table_name}` ({col_names}) VALUES ({placeholders})"

    with conn.cursor() as cursor:
        # 清空旧数据
        cursor.execute(f"TRUNCATE TABLE `{table_name}`")
        rows = [tuple(row) for row in df.values]
        cursor.executemany(sql, rows)
    conn.commit()
    print(f'[OK] Loaded {len(df)} rows into {table_name}')


def main():
    print('[INFO] ETL Script started at', datetime.now().isoformat())

    # 1. 解析原始数据
    print('[INFO] Parsing raw data files...')
    host_df = parse_host_detail()
    pref_df = parse_pref_tsar()
    disk_df = parse_disk_tsar()
    print(f'[INFO] HostDetail: {len(host_df)} rows')
    print(f'[INFO] PrefTsar: {len(pref_df)} rows')
    print(f'[INFO] DiskTsar: {len(disk_df)} rows')

    # 2. 数据转换
    print('[INFO] Transforming data...')
    perf_df = transform_performance_hourly(pref_df)
    disk_hourly_df = transform_disk_hourly(disk_df)
    net_df = transform_network_hourly(pref_df)
    status_df = transform_status_snapshot(pref_df, host_df)
    print(f'[INFO] ServerPerformanceHourly: {len(perf_df)} rows')
    print(f'[INFO] DiskPerformanceHourly: {len(disk_hourly_df)} rows')
    print(f'[INFO] NetworkTrafficHourly: {len(net_df)} rows')
    print(f'[INFO] ServerStatusSnapshot: {len(status_df)} rows')

    # 3. 加载到 MySQL
    print('[INFO] Connecting to MySQL...')
    conn = get_db_connection()
    try:
        load_to_mysql(perf_df, 'ServerPerformanceHourly', conn)
        load_to_mysql(disk_hourly_df, 'DiskPerformanceHourly', conn)
        load_to_mysql(net_df, 'NetworkTrafficHourly', conn)
        load_to_mysql(status_df, 'ServerStatusSnapshot', conn)
    finally:
        conn.close()

    print('[INFO] ETL Script finished at', datetime.now().isoformat())


if __name__ == '__main__':
    main()
