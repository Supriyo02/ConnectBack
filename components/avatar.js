import Image from "next/image";

export default function Avatar({size,url}) {
  let width='w-11';
  if(size==='lg'){
      width='w-32 md:w-36';
  }
  
  return (
      <div className="p-2">
          <img className={`${width} rounded-full overflow-hidden`} src={url} alt="" />
      </div>
  )
};