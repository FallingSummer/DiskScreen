import type { EChartsOption } from 'echarts';

export const ChartThemeColors = {
  primary: '#00f6ff',
  secondary: '#00baff',
  tertiary: '#0075ff',
  accent: '#ffde00',
  surface: '#0c2238',
  text: '#dff7ff',
} as const;

export const TechPalette = {
  series: ['#00f6ff', '#00baff', '#0075ff', '#6a00ff', '#d400ff'],
  highlight: '#ffde00',
  axis: 'rgba(0, 246, 255, 0.25)',
  splitLine: 'rgba(0, 246, 255, 0.08)',
} as const;

export const DefaultChartOption = (title: string): EChartsOption => ({
  backgroundColor: 'transparent',
  title: {
    text: title,
    left: 'center',
    textStyle: {
      color: ChartThemeColors.text,
      fontSize: 16,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(3, 16, 29, 0.92)',
    borderColor: 'rgba(0, 246, 255, 0.25)',
    textStyle: {
      color: ChartThemeColors.text,
    },
  },
  grid: {
    left: '8%',
    right: '8%',
    top: '20%',
    bottom: '8%',
  },
  textStyle: {
    color: ChartThemeColors.text,
  },
});
