
interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="flex justify-center mb-8">
      <span className="text-[#8B5CF6] text-sm font-semibold tracking-wider uppercase">
        {title}
      </span>
    </div>
  );
};

export default SectionTitle;
