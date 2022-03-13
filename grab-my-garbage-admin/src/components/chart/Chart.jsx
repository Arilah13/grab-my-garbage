import React from 'react'
import './Chart.css'
import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const chart = ({title, data, dataKey, grid, data1, dataKey1}) => {
    return (
      <div className = 'chart'>
        <h3 className = 'chartTitle'>{title}</h3>
        <ResponsiveContainer width = '100%' aspect={4 / 1}>
          <LineChart data = {data}>
            <XAxis dataKey = 'name' stroke = 'blue' />
            <Line type = 'monotone' dataKey = {dataKey} stroke = 'darkblue' />
            <Line type = 'monotone' dataKey = {dataKey1} stroke = 'lightblue' />
            <Tooltip />
            {grid && <CartesianGrid stroke = '#e0dfdf' strokeDasharray = '5 5' />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
}

export default chart