const ClubKit = ({ data }: { data: any }) => {
  return (
    <>
      <p className="mt-8 text-gray-300 text-sm leading-6 tracking-widest">
        Born from Earth's last unified monarchic alliance during the Age of
        Collapse, Galactic Crown was created as a symbol of human order, beauty
        and transcendence through football. The club was the brainchild of the
        High Proton of Europa, who believed sport could unify fragmented Earth
        territories after the Great Data Purge of 2024.
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
              Lorem ipsum dolor sit amet consectetur, id arcu sollicitudin
              dignissim sed tincidunt. Viverra adipiscing mauris lectus
              tincidunt vitae nunc. Quis tellus diam ac aliquam. Praesent
              hendrerit accumsan a orci morta ipsum ac non. Nisi tellus ac
              ultricies etiam eget neque faucibus. Nullam faucibus lectus
              viverra ut lacinia.
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-6 flex items-end justify-center">
              <span className="text-[#A201E2] text-lg">...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubKit;
