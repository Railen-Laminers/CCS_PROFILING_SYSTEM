import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar, 
} from 'recharts';

/**
 * Enrollment Trend Area Chart (Premium Aesthetic)
 */
export const EnrollmentTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
      <XAxis 
        dataKey="name" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
        dy={10}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
        domain={[0, 'auto']}
        allowDecimals={false}
      />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '16px', 
          backgroundColor: 'rgba(31, 41, 55, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          padding: '12px 16px',
          color: '#fff'
        }}
        itemStyle={{ color: '#F97316', fontWeight: 'bold' }}
        cursor={{ stroke: '#F97316', strokeWidth: 1, strokeDasharray: '5 5' }}
      />
      <Area 
        name="students"
        type="monotone" 
        dataKey="students" 
        stroke="#F97316" 
        strokeWidth={3}
        fillOpacity={1} 
        fill="url(#colorStudents)"
        dot={{ r: 4, fill: '#1F2937', stroke: '#F97316', strokeWidth: 2 }}
        activeDot={{ r: 6, fill: '#F97316', stroke: '#fff', strokeWidth: 2 }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

/**
 * Custom Label for Pie Chart
 */
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

    return (
        <text 
            x={x} 
            y={y} 
            fill={COLORS[index % COLORS.length]} 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
        >
            {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

/**
 * Department Distribution Pie Chart (Full pie with external labels)
 */
export const DepartmentDistributionChart = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          labelLine={true}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * Grade Distribution Bar Chart (Matching reference design)
 */
export const GradeDistributionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.5} />
      <XAxis 
        dataKey="name" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#9CA3AF', fontSize: 11 }}
        dy={10}
        label={{ value: 'GPA Performance Ranges', position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#9CA3AF', fontSize: 11 }}
        allowDecimals={false}
        domain={[0, 'auto']}
        label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', offset: 10, fill: '#6B7280', fontSize: 11, fontWeight: 'bold' }}
      />
      <Tooltip 
        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
                const labels = {
                    '4.1 - 5.0 (A)': { text: 'Excellent', color: '#F97316' },
                    '3.1 - 4.0 (B)': { text: 'Very Good', color: '#F97316' },
                    '2.1 - 3.0 (C)': { text: 'Good', color: '#F97316' },
                    '1.1 - 2.0 (D)': { text: 'Fair', color: '#F97316' },
                    '0.0 - 1.0 (F)': { text: 'Academic Risk', color: '#F97316' }
                };
                const info = labels[label] || { text: 'GPA Record', color: '#F97316' };

                return (
                    <div className="bg-[#1F2937] border border-[#374151] p-4 rounded-xl shadow-2xl backdrop-blur-md">
                        <p className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] mb-1">Status: {info.text}</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <p className="text-[15px] font-bold text-white">{label}</p>
                        </div>
                        <p className="text-sm text-[#9CA3AF] mt-2">
                            Count: <span className="text-orange-500 font-black">{payload[0].value}</span> Students
                        </p>
                    </div>
                );
            }
            return null;
        }}
      />
      <Bar 
        name="Student Count"
        dataKey="count" 
        fill="#F97316"
        radius={[6, 6, 0, 0]} 
        barSize={80}
        label={{ position: 'top', fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold', offset: 10 }}
      />
    </BarChart>
  </ResponsiveContainer>
);
