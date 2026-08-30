import data from "../data.json";

const sans = "Inter, 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif";
const serif = "'Noto Serif SC', 'Songti SC', serif";

function BrandMark({ compact = false }: { compact?: boolean }) {
  if (data.brand.logoUrl) {
    return (
      <img
        src={data.brand.logoUrl}
        alt={data.brand.name || "Logo"}
        className={`block object-contain object-left ${compact ? "w-[104px] h-[72px]" : "w-[126px] h-[126px]"}`}
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

function QrCode({ size = 126 }: { size?: number }) {
  return (
    <div
      className="shrink-0 p-[7px] border border-[#dedad3] bg-white"
      style={{ width: size, height: size }}
    >
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
  );
}

function OverlayBrandMark() {
  if (data.brand.logoUrl) {
    return (
      <img
        src={data.brand.logoUrl}
        alt={data.brand.name || "Logo"}
        className="block w-[112px] h-[74px] object-contain object-right"
      />
    );
  }

  return (
    <div className="text-right drop-shadow-[0_2px_10px_rgba(0,0,0,.55)]">
      <div className="text-[18px] font-extrabold tracking-[-0.035em] text-white">
        {data.brand.name}
      </div>
      <div className="mt-2 text-[8px] font-semibold tracking-[0.24em] text-white/58">
        {data.brand.tagline}
      </div>
    </div>
  );
}

function EditorialLayout() {
  return (
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
              <span className="tracking-[0.06em]">农历 {data.date.lunar}</span>
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
        <BrandMark />

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
          <QrCode />
        </div>
      </footer>
    </main>
  );
}

function CinemaLayout() {
  return (
    <main
      className="w-[960px] h-[1320px] overflow-hidden bg-[#f4f0e8] flex flex-col"
      style={{
        borderRadius: 18,
        boxShadow:
          "0 28px 70px rgba(18, 17, 14, 0.16), 0 4px 14px rgba(18, 17, 14, 0.08)",
      }}
    >
      <figure className="relative m-0 h-[723px] shrink-0 overflow-hidden bg-[#090a09]">
        <img
          src={data.movie.stillUrl}
          alt={`${data.movie.title}电影剧照`}
          className="absolute inset-0 block w-full h-full object-cover"
          style={{ filter: "saturate(.82) contrast(1.06) brightness(.84)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,5,5,.5) 0%, rgba(4,5,5,0) 20%, rgba(4,5,5,0) 100%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-[62px] bg-[#090a09]/80 border-b border-white/10" />
        <div className="absolute top-[25px] left-[44px] text-[11px] font-semibold tracking-[0.34em] text-white/70 uppercase">
          {data.header.slogan}
        </div>
      </figure>

      <section className="h-[72px] shrink-0 px-[54px] flex items-center justify-between gap-8 bg-[#111311] text-white">
        <h1 className="m-0 min-w-0 text-[25px] font-bold tracking-[-0.025em] truncate">
          《{data.movie.title}》
        </h1>
        <div className="shrink-0 text-[13px] font-medium tracking-[0.06em] text-white/65">
          导演 {data.movie.director} · {data.movie.year}
        </div>
      </section>

      <section className="h-[225px] shrink-0 px-[76px] flex items-center justify-center border-b border-[#d8d1c4] bg-[#f8f5ee]">
        <blockquote className="m-0 max-w-[790px] text-center">
          <p
            className="m-0 text-[31px] leading-[1.55] font-semibold tracking-[-0.025em] text-[#252521]"
            style={{ fontFamily: serif }}
          >
            “{data.quote.text}”
          </p>
          {data.quote.speaker ? (
            <footer className="mt-3 text-[12px] font-medium tracking-[0.12em] text-[#8b867d]">
              -- {data.quote.speaker}
            </footer>
          ) : null}
        </blockquote>
      </section>

      <footer className="h-[300px] shrink-0 px-[54px] py-[32px] grid grid-cols-[190px_1fr] gap-[42px] bg-[#f4f0e8]">
        <section className="border-r border-[#cec6b8] pr-[34px] flex flex-col justify-between">
          <div>
            <div className="text-[15px] font-bold tracking-[0.25em] text-[#34332e]">
              {data.date.month}
            </div>
            <div className="mt-1 text-[110px] font-medium leading-[0.92] tracking-[-0.075em] text-[#171817] tabular-nums">
              {data.date.day}
            </div>
            <div className="mt-4 text-[12px] font-bold tracking-[0.15em] text-[#666158]">
              {data.date.weekday}
            </div>
            <div className="mt-2 text-[12px] tracking-[0.04em] text-[#898277]">
              农历 {data.date.lunar}
            </div>
          </div>
        </section>

        <section className="flex flex-col items-end justify-center gap-7 text-right">
          <div className="flex items-center gap-5">
            <BrandMark compact />
            <QrCode size={118} />
          </div>
          <div>
            {data.qr.slogan ? (
              <div className="text-[11px] font-bold leading-[1.55] tracking-[0.12em] text-[#34332e]">
                {data.qr.slogan}
              </div>
            ) : null}
          </div>
        </section>
      </footer>
    </main>
  );
}

function PortraitLayout() {
  return (
    <main
      className="relative w-[960px] h-[1320px] overflow-hidden bg-[#111311] text-white"
      style={{
        borderRadius: 18,
        boxShadow:
          "0 28px 70px rgba(18, 17, 14, 0.22), 0 4px 14px rgba(18, 17, 14, 0.10)",
      }}
    >
      <img
        src={data.movie.stillUrl}
        alt={`${data.movie.title}电影剧照`}
        className="absolute inset-0 block w-full h-full object-cover"
        style={{ filter: "saturate(.86) contrast(1.05) brightness(.9)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,8,7,.48) 0%, rgba(7,8,7,.04) 25%, rgba(7,8,7,.08) 48%, rgba(7,8,7,.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,6,5,.2) 0%, rgba(5,6,5,0) 48%, rgba(5,6,5,.12) 100%)",
        }}
      />

      <header className="absolute top-[58px] left-[58px] right-[58px] flex items-start justify-between">
        <div className="flex items-start gap-5 drop-shadow-[0_2px_12px_rgba(0,0,0,.45)]">
          <div className="text-[112px] font-light leading-[0.82] tracking-[-0.075em] tabular-nums">
            {data.date.day}
          </div>
          <div className="pt-1 border-l border-white/55 pl-5">
            <div className="text-[15px] font-bold tracking-[0.22em]">
              {data.date.month}
            </div>
            <div className="mt-3 text-[12px] font-semibold tracking-[0.16em] text-white/78">
              {data.date.weekday}
            </div>
            <div className="mt-3 max-w-[190px] text-[12px] leading-[1.5] tracking-[0.04em] text-white/68">
              农历 {data.date.lunar}
            </div>
          </div>
        </div>
        <div className="pt-1 text-[11px] font-semibold tracking-[0.32em] text-white/72 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,.5)]">
          {data.header.slogan}
        </div>
      </header>

      <section className="absolute left-[58px] right-[58px] bottom-[210px] drop-shadow-[0_2px_14px_rgba(0,0,0,.55)]">
        <blockquote className="m-0 max-w-[815px]">
          <p
            className="m-0 text-[32px] leading-[1.58] font-semibold tracking-[-0.025em] text-white"
            style={{ fontFamily: serif }}
          >
            “{data.quote.text}”
          </p>
          {data.quote.speaker ? (
            <footer className="mt-3 text-[12px] font-medium tracking-[0.12em] text-white/68">
              -- {data.quote.speaker}
            </footer>
          ) : null}
        </blockquote>
      </section>

      <footer className="absolute left-[58px] right-[58px] bottom-[46px] pt-[24px] flex items-end justify-between gap-8 border-t border-white/35 drop-shadow-[0_2px_12px_rgba(0,0,0,.5)]">
        <div className="min-w-0 pb-2">
          <h1 className="m-0 text-[37px] font-bold leading-none tracking-[-0.04em] truncate">
            《{data.movie.title}》
          </h1>
          <div className="mt-4 text-[14px] font-medium tracking-[0.06em] text-white/72">
            {data.movie.year} · 导演 {data.movie.director}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-3 text-right">
          <div className="flex items-center gap-4">
            <OverlayBrandMark />
            <QrCode size={96} />
          </div>
          {data.qr.slogan ? (
            <div className="text-[10px] font-semibold tracking-[0.12em] text-white/72">
              {data.qr.slogan}
            </div>
          ) : null}
        </div>
      </footer>
    </main>
  );
}

export default function DailyMoviePoster() {
  const layout = (data.appearance as { layout?: string }).layout;

  return (
    <div
      className="w-[1080px] h-[1440px] flex items-center justify-center"
      style={{
        fontFamily: sans,
        backgroundColor: data.appearance.grayBackground
          ? "#e5e3df"
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

      {layout === "cinema" ? (
        <CinemaLayout />
      ) : layout === "portrait" ? (
        <PortraitLayout />
      ) : (
        <EditorialLayout />
      )}
    </div>
  );
}
