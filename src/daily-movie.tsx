import data from "../data.json";

const sans = "Inter, 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif";
const serif = "'Noto Serif SC', 'Songti SC', serif";

function BrandMark() {
  if (data.brand.logoUrl) {
    return (
      <img
        src={data.brand.logoUrl}
        alt={data.brand.name || "Logo"}
        className="block w-[126px] h-[126px] object-contain object-left"
      />
    );
  }

  return (
    <div className="flex items-center gap-4">
      <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden>
        <rect x="2" y="2" width="31" height="31" fill="#111111" />
        <rect
          x="21"
          y="21"
          width="31"
          height="31"
          fill="none"
          stroke="#111111"
          strokeWidth="3"
        />
        <path
          d="M13 16h11M13 21h7"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
      </svg>
      <div>
        <div className="text-[28px] font-extrabold tracking-[-0.045em] leading-none text-[#111111]">
          {data.brand.name}
        </div>
        <div className="mt-2 text-[10px] font-semibold tracking-[0.3em] text-[#77736e]">
          {data.brand.tagline}
        </div>
      </div>
    </div>
  );
}

export default function DailyMoviePoster() {
  return (
    <div
      className="w-[1080px] h-[1440px] flex items-center justify-center"
      style={{
        fontFamily: sans,
        backgroundColor: data.appearance.grayBackground
          ? "#eceeed"
          : "transparent",
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@500;600;700&display=swap"
      />

      <main
        className="w-[960px] h-[1320px] overflow-hidden bg-white flex flex-col"
        style={{
          borderRadius: 32,
          boxShadow:
            "0 22px 60px rgba(25, 31, 29, 0.10), 0 3px 10px rgba(25, 31, 29, 0.05)",
        }}
      >
        <header className="h-[235px] shrink-0 px-[54px] pt-[48px] flex justify-between border-b border-[#ebe8e2]">
          <section className="w-[475px] min-w-0 pt-1">
            <div className="text-[13px] tracking-[0.28em] font-semibold text-[#a19c94] uppercase">
              {data.header.slogan}
            </div>
            <h1 className="mt-7 text-[48px] font-bold leading-[1.05] tracking-[-0.055em] text-[#161616] truncate">
              {data.movie.title}
            </h1>
            <div className="mt-5 flex items-center gap-3 text-[17px] text-[#625f5a]">
              <span className="font-semibold text-[#242321]">导演</span>
              <span>{data.movie.director}</span>
              <span className="text-[#c5c1ba]">/</span>
              <span>{data.movie.year}</span>
            </div>
          </section>

          <section className="w-[305px] flex justify-end text-right">
            <div className="pt-1">
              <div className="text-[18px] font-bold tracking-[0.27em] text-[#252422]">
                {data.date.month}
              </div>
              <div className="-mt-3 text-[132px] font-black leading-none tracking-[-0.085em] text-[#111111] tabular-nums">
                {data.date.day}
              </div>
              <div className="mt-1 flex items-center justify-end gap-4 text-[13px] font-semibold tracking-[0.13em] text-[#77736d]">
                <span>{data.date.weekday}</span>
                <span className="w-px h-[14px] bg-[#d9d5ce]" />
                <span className="tracking-[0.06em]">
                  农历 {data.date.lunar}
                </span>
              </div>
            </div>
          </section>
        </header>

        <section className="h-[175px] shrink-0 px-[62px] flex items-center bg-[#fbfaf7]">
          <div className="w-[5px] h-[76px] bg-[#171717] mr-7 shrink-0" />
          <blockquote className="m-0">
            <p
              className="text-[33px] leading-[1.55] font-semibold tracking-[-0.025em] text-[#1f1e1c]"
              style={{ fontFamily: serif }}
            >
              “{data.quote.text}”
            </p>
            {data.quote.speaker ? (
              <footer className="mt-3 text-[14px] font-medium tracking-[0.08em] text-[#8f8a83]">
                -- {data.quote.speaker}
              </footer>
            ) : null}
          </blockquote>
        </section>

        <figure className="m-0 h-[670px] shrink-0 bg-[#dedbd4] overflow-hidden">
          <img
            src={data.movie.stillUrl}
            alt={`${data.movie.title}电影剧照`}
            className="block w-full h-full object-cover"
            style={{ borderRadius: 0 }}
          />
        </figure>

        <footer className="h-[240px] shrink-0 px-[54px] flex items-center justify-between">
          <div>
            <BrandMark />
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              {data.qr.slogan ? (
                <div className="text-[13px] font-bold tracking-[0.18em] text-[#2a2927]">
                  {data.qr.slogan}
                </div>
              ) : null}
              {data.qr.description.length ? (
                <div className="mt-2 text-[11px] leading-[1.55] text-[#9a958e]">
                  {data.qr.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="w-[126px] h-[126px] p-[7px] border border-[#dedad3] bg-white">
              <img
                src={data.qr.imageUrl}
                alt="影片详情二维码"
                className="block w-full h-full"
                style={
                  data.qr.monochrome
                    ? { filter: "grayscale(1) brightness(70%) contrast(1000%)" }
                    : undefined
                }
              />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
