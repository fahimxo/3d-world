const ClubKit = ({ data }: { data: any }) => {
  return (
    <>
      <p className="mt-8 text-gray-300 text-sm leading-6 tracking-widest">
        {data?.lore}
      </p>
      <div className="mt-4.5 h-px bg-white w-full opacity-50" />
      <div className="mt-3.5">
        <h3 className="text-white text-lg font-bold mb-3.5">Club Kit</h3>
        <div className="w-full flex items-stretch gap-4 h-[192px]">
          <div className="flex-1 h-full">
            <video
              src={data?.kitVideoUrl}
              controls
              className="w-full h-full rounded-lg border-none object-cover"
            />
          </div>
          <div className="flex-1 h-full overflow-hidden relative">
            <p className="text-gray-300 text-sm leading-6 tracking-widest h-full overflow-hidden">
              {data?.lore}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubKit;
