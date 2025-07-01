// Reusable component for displaying dashboard statistics.
interface StatCardProps {
    title: string;
    value: number;
    description: string;
    color: string;
  }
  const StatCard: React.FC<StatCardProps> = ({ title, value, description, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border-t-4 ${color} transform transition duration-300 hover:scale-105 hover:shadow-lg`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  export default StatCard