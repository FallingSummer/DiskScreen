-- ============================================================
-- 大屏数据可视化系统 - 结果表建表脚本
-- 命名规范：表名与字段名统一使用大驼峰命名法 (PascalCase)
-- ============================================================

CREATE DATABASE IF NOT EXISTS DataScreenDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE DataScreenDB;

-- ------------------------------------------------------------
-- 1. 主机性能指标小时聚合表
-- 来源：PrefTsar 原始表按小时汇总
-- ------------------------------------------------------------
DROP TABLE IF EXISTS ServerPerformanceHourly;
CREATE TABLE ServerPerformanceHourly (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    HostId VARCHAR(32) NOT NULL COMMENT '主机编号',
    StatHour DATETIME NOT NULL COMMENT '统计小时',
    CpuUsageAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT 'CPU使用率平均值',
    CpuUsageMax DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT 'CPU使用率最大值',
    CpuIdleAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT 'CPU空闲率平均值',
    MemUsedAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '内存使用平均值',
    MemFreeAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '内存空闲平均值',
    MemCacheAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '内存缓存平均值',
    Load1Avg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '1分钟负载平均值',
    Load5Avg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '5分钟负载平均值',
    Load15Avg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '15分钟负载平均值',
    ProcRunAvg INT NOT NULL DEFAULT 0 COMMENT '运行进程数平均值',
    ProcBlockAvg INT NOT NULL DEFAULT 0 COMMENT '阻塞进程数平均值',
    ProcTotalAvg INT NOT NULL DEFAULT 0 COMMENT '总进程数平均值',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    UNIQUE KEY UQ_Host_Hour (HostId, StatHour),
    KEY IDX_StatHour (StatHour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务器性能指标小时聚合表';

-- ------------------------------------------------------------
-- 2. 磁盘性能指标小时聚合表
-- 来源：DiskTsar 原始表按小时与磁盘名汇总
-- ------------------------------------------------------------
DROP TABLE IF EXISTS DiskPerformanceHourly;
CREATE TABLE DiskPerformanceHourly (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    HostId VARCHAR(32) NOT NULL COMMENT '主机编号',
    StatHour DATETIME NOT NULL COMMENT '统计小时',
    DiskName VARCHAR(16) NOT NULL COMMENT '磁盘名，如 sda/sdb',
    ReadAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '读扇区平均值',
    WriteAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '写扇区平均值',
    RqmAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '每秒合并请求平均值',
    UtilAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '磁盘利用率平均值',
    AwaitAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '平均等待时间(ms)',
    SvctmAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '平均服务时间(ms)',
    AvgrqAvg DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '平均请求扇区数',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    UNIQUE KEY UQ_Host_Disk_Hour (HostId, DiskName, StatHour),
    KEY IDX_StatHour (StatHour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='磁盘性能指标小时聚合表';

-- ------------------------------------------------------------
-- 3. 网络流量指标小时聚合表
-- 来源：PrefTsar 原始表按小时汇总
-- ------------------------------------------------------------
DROP TABLE IF EXISTS NetworkTrafficHourly;
CREATE TABLE NetworkTrafficHourly (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    HostId VARCHAR(32) NOT NULL COMMENT '主机编号',
    StatHour DATETIME NOT NULL COMMENT '统计小时',
    NetInAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '入网流量平均值(MB/s)',
    NetOutAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '出网流量平均值(MB/s)',
    NetPktInAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '入网包数平均值',
    NetPktOutAvg DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '出网包数平均值',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    UNIQUE KEY UQ_Host_Hour (HostId, StatHour),
    KEY IDX_StatHour (StatHour)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='网络流量指标小时聚合表';

-- ------------------------------------------------------------
-- 4. 服务器实时状态快照表
-- 来源：PrefTsar + HostDetail 最新时间点聚合
-- ------------------------------------------------------------
DROP TABLE IF EXISTS ServerStatusSnapshot;
CREATE TABLE ServerStatusSnapshot (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    HostId VARCHAR(32) NOT NULL COMMENT '主机编号',
    HostName VARCHAR(128) NOT NULL DEFAULT '' COMMENT '主机名',
    Model VARCHAR(64) NOT NULL DEFAULT '' COMMENT '机型',
    Location1 VARCHAR(64) NOT NULL DEFAULT '' COMMENT '机房位置1',
    Location2 VARCHAR(64) NOT NULL DEFAULT '' COMMENT '机房位置2',
    CpuUsage DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '当前CPU使用率',
    MemUsed DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '当前内存使用',
    MemTotal DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '当前内存总量估算',
    NetIn DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '当前入网流量',
    NetOut DECIMAL(12, 2) NOT NULL DEFAULT 0 COMMENT '当前出网流量',
    Load1 DECIMAL(8, 2) NOT NULL DEFAULT 0 COMMENT '当前1分钟负载',
    ProcRun INT NOT NULL DEFAULT 0 COMMENT '当前运行进程数',
    AlertLevel VARCHAR(16) NOT NULL DEFAULT 'Normal' COMMENT '告警级别 Normal/Warning/Critical',
    UpdateTime DATETIME NOT NULL COMMENT '数据更新时间',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    UNIQUE KEY UQ_HostId (HostId),
    KEY IDX_AlertLevel (AlertLevel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务器实时状态快照表';
