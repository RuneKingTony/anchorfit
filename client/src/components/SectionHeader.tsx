
interface SectionHeaderProps {
  title: string;
  subtitle: string;
  showDivider?: boolean;
}

const SectionHeader = ({ title, subtitle, showDivider = true }: SectionHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white mb-4">
        {title}
      </h2>
      <p className="text-xl text-gray-200 mb-8">
        {subtitle}
      </p>
      {showDivider && (
        <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto rounded-full"></div>
      )}
    </div>
  );
};

export default SectionHeader;
