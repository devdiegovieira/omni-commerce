import React from 'react';
import PropTypes from 'prop-types';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
} from 'recharts';


function DailySalesChart(props) {
  const { chartData } = props;

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData.data}
          margin={{ top: 10, right: 30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">

              <stop offset="95%" stopColor="#D156CB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">

              <stop offset="95%" stopColor="#1AAB00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Legend verticalAlign="top" height={30} align={'right'} />
          <XAxis dataKey="day" interval={2} />
          <YAxis tickFormatter={(chartData) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(chartData)} />
          <CartesianGrid horizontal="true" vertical="" />
          <Tooltip formatter={(chartData) => new Intl.NumberFormat('pt-BR').format(chartData)} />
          <Area type="natural" legendType="triangle" dataKey={chartData.row1} name="Mês anterior" stroke="#4741b5" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="natural" legendType="diamond" dataKey={chartData.row2} name="Este mês" stroke="#14ff6c" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

DailySalesChart.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default DailySalesChart;
