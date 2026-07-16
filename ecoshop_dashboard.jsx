import React, { useState } from "react";

const data = {
  totals: { revenue: 942664, commission: -356373, logistics: -90170, promo: -157961, storage: -965, other: -15869, cogs: -293384, grossProfit: 21293, tax: -28199, netProfit: -6905, orders: 691, cancels: 113, buyouts: 454 },
  products: [
    { id: 1, name: "JBL Pro 5 чёрный", cat: "Наушники", rev: 299090, profit: -13933, promo: -57370, drr: 19.2, comm: 38.0, log: 6.4, cogs: 35.8, orders: 197, buyout: 68.0, avgPrice: 2232, margin: -1.8, action: "cut_promo", hypothesis: "Снизить ДРР до 10–12%. При текущей выручке 299К снижение промо на 25К выведет товар в плюс ~+11К. Товар уже имеет органический спрос (197 заказов) — тратить на рекламу 19% бессмысленно." },
    { id: 2, name: "JBL 860 белый", cat: "Наушники", rev: 57775, profit: -21121, promo: -31547, drr: 54.6, comm: 38.0, log: 8.4, cogs: 30.3, orders: 36, buyout: 69.4, avgPrice: 2312, margin: -33.6, action: "stop_promo", hypothesis: "СТОП продвижение. ДРР 54.6% — каждый рубль выручки стоит 55 копеек рекламы. Полная остановка промо сэкономит 31.5К и переведёт товар в прибыль ~+10К. Без рекламы заказы упадут, но убыток прекратится." },
    { id: 3, name: "JBL 860 синий", cat: "Наушники", rev: 28590, profit: -4314, promo: -10742, drr: 37.6, comm: 37.6, log: 9.9, cogs: 24.5, orders: 13, buyout: 46.2, avgPrice: 2859, margin: -11.7, action: "stop_promo", hypothesis: "СТОП продвижение + пересмотр цены. ДРР 37.6% при выкупе 46% — двойной удар. Только 6 из 13 заказов выкупается. Остановка промо + повышение цены на 10–15% или вывод из ассортимента." },
    { id: 4, name: "Мыло хозяйственное", cat: "Мыло", rev: 5210, profit: -913, promo: -1489, drr: 28.6, comm: 44.8, log: 20.4, cogs: 17.3, orders: 14, buyout: 57.1, avgPrice: 521, margin: -14.1, action: "stop_promo", hypothesis: "Убрать из продвижения. Комиссия 44.8% + логистика 20.4% = 65% уходит маркетплейсу. Товар дешёвый (521₽), а логистика фиксированная — каждый заказ убыточен. Без промо останется органика." },
    { id: 5, name: "JBL Pro 5 золотой", cat: "Наушники", rev: 49600, profit: -494, promo: -3745, drr: 7.6, comm: 37.9, log: 10.0, cogs: 40.3, orders: 31, buyout: 74.2, avgPrice: 1985, margin: 1.7, action: "raise_price", hypothesis: "Поднять цену на 5–7%. Себестоимость 40.3% — самая высокая среди наушников. Повышение цены на 100–150₽ не убьёт спрос, но даст +3–5К прибыли. Или пересмотреть закупочную цену." },
    { id: 6, name: "Labubu брелок", cat: "Другое", rev: 300, profit: -165, promo: 0, drr: 0, comm: 20.0, log: 10.5, cogs: 116.7, orders: 1, buyout: 100, avgPrice: 300, margin: -49.3, action: "remove", hypothesis: "Убрать из ассортимента. Себестоимость 350₽ при цене продажи 300₽ — товар продаётся в убыток даже без рекламы. Каждая продажа = гарантированный минус." },
    { id: 7, name: "Витамин Д3 К2 10000", cat: "БАДы", rev: 46168, profit: 12515, promo: -9167, drr: 19.9, comm: 40.9, log: 7.3, cogs: 0, orders: 50, buyout: 60.0, avgPrice: 1592, margin: 29.5, action: "scale", hypothesis: "Масштабировать! Маржа 29.5% — лучшая в магазине. Увеличить бюджет промо на 30–50% для роста заказов. Оптимизировать карточку для повышения выкупа с 60% до 70%+." },
    { id: 8, name: "Эпимедиумная паста", cat: "БАДы", rev: 73999, profit: 6436, promo: -4058, drr: 5.5, comm: 32.0, log: 15.8, cogs: 32.1, orders: 118, buyout: 67.8, avgPrice: 841, margin: 11.9, action: "scale", hypothesis: "Лидер по заказам (118). ДРР всего 5.5% — можно увеличить промо до 8–10% для роста объёма. При росте заказов на 30% прибыль вырастет на ~3–4К. Высокая логистика (15.8%) — рассмотреть упаковку." },
    { id: 9, name: "Mass Former 20 капс", cat: "Mass Former", rev: 139573, profit: 4336, promo: -12243, drr: 8.8, comm: 42.3, log: 12.8, cogs: 27.7, orders: 103, buyout: 56.3, avgPrice: 1458, margin: 5.9, action: "optimize", hypothesis: "Низкий выкуп 56.3% — главная проблема. Улучшить описание, фото, размер упаковки. Каждые +5% выкупа = +7К прибыли. Комиссия 42.3% — проверить возможность снижения категории." },
    { id: 10, name: "Монталин", cat: "БАДы", rev: 34440, profit: 5419, promo: -1139, drr: 3.3, comm: 32.0, log: 13.0, cogs: 30.5, orders: 33, buyout: 69.7, avgPrice: 1148, margin: 18.8, action: "scale", hypothesis: "Высокая маржа 18.8% при минимальном ДРР 3.3%. Увеличить промо-бюджет в 2–3 раза — потенциал роста заказов с 33 до 60–80 при сохранении маржи 15%+." },
    { id: 11, name: "Mass Former 60 капс", cat: "Mass Former", rev: 33920, profit: 1739, promo: -4427, drr: 13.1, comm: 34.0, log: 5.4, cogs: 35.5, orders: 13, buyout: 76.9, avgPrice: 3392, margin: 9.3, action: "optimize", hypothesis: "Хороший выкуп 76.9%, но высокий ДРР 13%. Снизить промо до 8% и перераспределить бюджет на Монталин/Эпимедиумную пасту. Себестоимость 35.5% — пересмотреть закупку." },
    { id: 12, name: "Mass Former 40 капс", cat: "Mass Former", rev: 27995, profit: 367, promo: -4230, drr: 15.1, comm: 34.0, log: 11.8, cogs: 31.6, orders: 12, buyout: 66.7, avgPrice: 2537, margin: 5.2, action: "cut_promo", hypothesis: "ДРР 15.1% при марже 5.2% — промо съедает прибыль. Снизить ДРР до 8–10% или направить трафик на 60-капсульную версию (лучше маржа и выкуп)." },
    { id: 13, name: "JBL Pro 5 золотой (2)", cat: "Наушники", rev: 141728, profit: 3856, promo: -17701, drr: 12.5, comm: 37.7, log: 9.5, cogs: 32.2, orders: 64, buyout: 70.3, avgPrice: 2457, margin: 5.7, action: "optimize", hypothesis: "Прибыльный, но маржа тонкая (5.7%). Снижение ДРР с 12.5% до 8% добавит ~6К прибыли. Фокус на органическом продвижении: отзывы, инфографика, Rich-контент." },
    { id: 14, name: "Мыло 4шт", cat: "Мыло", rev: 3376, profit: 407, promo: 0, drr: 0, comm: 44.5, log: 16.1, cogs: 21.3, orders: 2, buyout: 100, avgPrice: 844, margin: 15.8, action: "keep", hypothesis: "Без промо и в плюсе. Оставить как есть — маленький объём, но стабильная органическая маржа. Не масштабировать — при рекламе уйдёт в минус из-за комиссии 44.5%." },
    { id: 15, name: "Мазь Монталин", cat: "БАДы", rev: 900, profit: 83, promo: 0, drr: 0, comm: 32.0, log: 16.6, cogs: 33.7, orders: 2, buyout: 50.0, avgPrice: 900, margin: 13.9, action: "keep", hypothesis: "Маленький объём, но маржинальный. Добавить в карточку основного Монталина как кросс-продажу для увеличения среднего чека." },
  ]
};

const actionLabels = { stop_promo: "🛑 Стоп промо", cut_promo: "✂️ Снизить промо", raise_price: "💰 Поднять цену", remove: "🗑️ Убрать", scale: "🚀 Масштабировать", optimize: "⚙️ Оптимизировать", keep: "✅ Оставить" };
const actionColors = { stop_promo: "#dc2626", cut_promo: "#f59e0b", raise_price: "#8b5cf6", remove: "#6b7280", scale: "#10b981", optimize: "#3b82f6", keep: "#6b7280" };

function fmt(n) { return n?.toLocaleString("ru-RU") ?? "—"; }
function pct(n) { return n != null ? n.toFixed(1) + "%" : "—"; }

export default function App() {
  const [tab, setTab] = useState("overview");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const losers = data.products.filter(p => p.profit < 0).sort((a,b) => a.profit - b.profit);
  const winners = data.products.filter(p => p.profit > 0).sort((a,b) => b.profit - a.profit);
  const totalLoss = losers.reduce((s,p) => s + p.profit, 0);
  const totalWin = winners.reduce((s,p) => s + p.profit, 0);
  const promoOnLosers = losers.reduce((s,p) => s + p.promo, 0);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0f1117", color: "#e2e4e9", minHeight: "100vh", padding: "24px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#6b7280", marginBottom: 4 }}>Eco Shop · Ozon · 01–16 июля 2026</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#f9fafb" }}>Диагностика убытка</h1>
          <p style={{ color: "#9ca3af", marginTop: 6, fontSize: 14, lineHeight: 1.5 }}>
            Магазин теряет <span style={{ color: "#ef4444", fontWeight: 600 }}>−{fmt(Math.abs(data.totals.netProfit))} ₽</span> при выручке {fmt(data.totals.revenue)} ₽.
            Ниже — причины и план действий.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#1a1d27", borderRadius: 10, padding: 4 }}>
          {[["overview","Диагностика"], ["products","Поартикульный"], ["plan","План действий"]].map(([k,l]) => (
            <button key={k} onClick={() => { setTab(k); setSelectedProduct(null); }}
              style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: tab === k ? "#2563eb" : "transparent", color: tab === k ? "#fff" : "#9ca3af" }}>
              {l}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div>
            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Чистая прибыль", value: `${fmt(data.totals.netProfit)} ₽`, color: "#ef4444" },
                { label: "Валовая выручка", value: `${fmt(data.totals.revenue)} ₽`, color: "#e2e4e9" },
                { label: "Маржа", value: pct(data.totals.netProfit / data.totals.revenue * 100), color: "#ef4444" },
              ].map((m, i) => (
                <div key={i} style={{ background: "#1a1d27", borderRadius: 12, padding: "16px 14px" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Waterfall explanation */}
            <div style={{ background: "#1a1d27", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#f9fafb" }}>Куда уходит выручка</h3>
              {[
                { label: "Выручка", value: data.totals.revenue, pct: 100, color: "#10b981", bar: true },
                { label: "Комиссия Ozon", value: data.totals.commission, pct: data.totals.commission / data.totals.revenue * 100, color: "#ef4444" },
                { label: "Продвижение", value: data.totals.promo, pct: data.totals.promo / data.totals.revenue * 100, color: "#f59e0b", highlight: true },
                { label: "Себестоимость", value: data.totals.cogs, pct: data.totals.cogs / data.totals.revenue * 100, color: "#8b5cf6" },
                { label: "Логистика", value: data.totals.logistics, pct: data.totals.logistics / data.totals.revenue * 100, color: "#3b82f6" },
                { label: "Налоги", value: data.totals.tax, pct: data.totals.tax / data.totals.revenue * 100, color: "#6b7280" },
                { label: "Прочее", value: data.totals.other + data.totals.storage + (data.totals.revenue + data.totals.commission + data.totals.promo + data.totals.cogs + data.totals.logistics + data.totals.tax + data.totals.other + data.totals.storage) * 0, pct: (data.totals.other + data.totals.storage) / data.totals.revenue * 100, color: "#6b7280" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 8, padding: item.highlight ? "6px 8px" : 0, background: item.highlight ? "#f59e0b15" : "transparent", borderRadius: 8, border: item.highlight ? "1px solid #f59e0b30" : "none" }}>
                  <div style={{ width: 140, fontSize: 12, color: item.highlight ? "#f59e0b" : "#9ca3af", fontWeight: item.highlight ? 600 : 400 }}>{item.label}</div>
                  <div style={{ flex: 1, height: 20, background: "#252830", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${Math.abs(item.pct)}%`, height: "100%", background: item.color + "40", borderRadius: 4 }} />
                  </div>
                  <div style={{ width: 100, textAlign: "right", fontSize: 13, fontWeight: 600, color: item.value >= 0 ? "#10b981" : "#e2e4e9" }}>
                    {fmt(item.value)} ₽
                  </div>
                  <div style={{ width: 50, textAlign: "right", fontSize: 11, color: "#6b7280" }}>{pct(Math.abs(item.pct))}</div>
                </div>
              ))}
            </div>

            {/* Root cause */}
            <div style={{ background: "linear-gradient(135deg, #1a1d27, #1e1215)", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid #ef444430" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#ef4444" }}>Главная причина убытка</h3>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d5db" }}>
                <p style={{ margin: "0 0 12px" }}>
                  <strong style={{ color: "#f9fafb" }}>6 убыточных товаров генерируют −{fmt(Math.abs(totalLoss))} ₽ убытка</strong>, в то время как
                  9 прибыльных приносят лишь +{fmt(totalWin)} ₽. Дефицит: {fmt(Math.abs(totalLoss) - totalWin)} ₽.
                </p>
                <p style={{ margin: "0 0 12px" }}>
                  На продвижение убыточных товаров потрачено <strong style={{ color: "#f59e0b" }}>{fmt(Math.abs(promoOnLosers))} ₽</strong> — это {pct(promoOnLosers / data.totals.promo * 100)} всего рекламного бюджета. Одни наушники JBL 860 белый «съели» 31.5К на рекламу при ДРР 54.6%.
                </p>
                <p style={{ margin: 0 }}>
                  Вторая проблема — <strong style={{ color: "#f9fafb" }}>комиссия Ozon в среднем 37.8%</strong> от выручки.  Вместе с промо (16.8%) это 54.6% — больше половины выручки уходит до себестоимости.
                </p>
              </div>
            </div>

            {/* Losers vs Winners */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#1a1d27", borderRadius: 14, padding: 16 }}>
                <h4 style={{ fontSize: 13, color: "#ef4444", margin: "0 0 12px", fontWeight: 600 }}>Убыточные товары</h4>
                {losers.map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #252830", fontSize: 12 }}>
                    <span style={{ color: "#d1d5db" }}>{p.name}</span>
                    <span style={{ color: "#ef4444", fontWeight: 600 }}>{fmt(p.profit)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 13, fontWeight: 700 }}>
                  <span>Итого</span><span style={{ color: "#ef4444" }}>{fmt(totalLoss)} ₽</span>
                </div>
              </div>
              <div style={{ background: "#1a1d27", borderRadius: 14, padding: 16 }}>
                <h4 style={{ fontSize: 13, color: "#10b981", margin: "0 0 12px", fontWeight: 600 }}>Прибыльные товары</h4>
                {winners.map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #252830", fontSize: 12 }}>
                    <span style={{ color: "#d1d5db" }}>{p.name}</span>
                    <span style={{ color: "#10b981", fontWeight: 600 }}>+{fmt(p.profit)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 13, fontWeight: 700 }}>
                  <span>Итого</span><span style={{ color: "#10b981" }}>+{fmt(totalWin)} ₽</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && !selectedProduct && (
          <div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>Нажмите на товар для подробного анализа и гипотезы</div>
            {data.products.sort((a,b) => a.profit - b.profit).map(p => (
              <div key={p.id} onClick={() => setSelectedProduct(p)}
                style={{ background: "#1a1d27", borderRadius: 12, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
                  border: `1px solid ${p.profit < 0 ? "#ef444420" : "#10b98120"}`, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = p.profit < 0 ? "#ef444460" : "#10b98160"}
                onMouseLeave={e => e.currentTarget.style.borderColor = p.profit < 0 ? "#ef444420" : "#10b98120"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>{p.name}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: actionColors[p.action] + "20", color: actionColors[p.action], fontWeight: 600 }}>
                      {actionLabels[p.action]}
                    </span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: p.profit < 0 ? "#ef4444" : "#10b981" }}>
                    {p.profit < 0 ? "" : "+"}{fmt(p.profit)} ₽
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7280" }}>
                  <span>Выручка: {fmt(p.rev)}</span>
                  <span>Заказы: {p.orders}</span>
                  <span>Выкуп: {pct(p.buyout)}</span>
                  <span style={{ color: p.drr > 20 ? "#f59e0b" : "#6b7280" }}>ДРР: {pct(p.drr)}</span>
                  <span>Комиссия: {pct(p.comm)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Detail */}
        {tab === "products" && selectedProduct && (
          <div>
            <button onClick={() => setSelectedProduct(null)}
              style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0 }}>
              ← Назад к списку
            </button>
            <div style={{ background: "#1a1d27", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "#f9fafb" }}>{selectedProduct.name}</h3>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{selectedProduct.cat} · Ср. цена {fmt(selectedProduct.avgPrice)} ₽</span>
                </div>
                <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, background: actionColors[selectedProduct.action] + "20", color: actionColors[selectedProduct.action], fontWeight: 700 }}>
                  {actionLabels[selectedProduct.action]}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { l: "Чистая прибыль", v: `${fmt(selectedProduct.profit)} ₽`, c: selectedProduct.profit < 0 ? "#ef4444" : "#10b981" },
                  { l: "Выручка", v: `${fmt(selectedProduct.rev)} ₽`, c: "#e2e4e9" },
                  { l: "Заказы", v: selectedProduct.orders, c: "#e2e4e9" },
                  { l: "Маржа", v: pct(selectedProduct.margin), c: selectedProduct.margin < 0 ? "#ef4444" : "#10b981" },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#252830", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{m.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: m.c }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Cost breakdown bars */}
              <h4 style={{ fontSize: 13, fontWeight: 600, margin: "0 0 10px", color: "#9ca3af" }}>Структура затрат (% от выручки)</h4>
              {[
                { l: "Комиссия", v: selectedProduct.comm, c: "#ef4444", warn: selectedProduct.comm > 38 },
                { l: "Себестоимость", v: selectedProduct.cogs, c: "#8b5cf6", warn: selectedProduct.cogs > 35 },
                { l: "Продвижение (ДРР)", v: selectedProduct.drr, c: "#f59e0b", warn: selectedProduct.drr > 15 },
                { l: "Логистика", v: selectedProduct.log, c: "#3b82f6", warn: selectedProduct.log > 12 },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ width: 130, fontSize: 12, color: item.warn ? item.c : "#9ca3af", fontWeight: item.warn ? 600 : 400 }}>
                    {item.warn ? "⚠ " : ""}{item.l}
                  </div>
                  <div style={{ flex: 1, height: 16, background: "#252830", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(item.v, 100)}%`, height: "100%", background: item.c + (item.warn ? "80" : "40"), borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ width: 50, textAlign: "right", fontSize: 12, fontWeight: 600, color: item.warn ? item.c : "#9ca3af" }}>{pct(item.v)}</div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                <div style={{ width: 130, fontSize: 12, color: "#6b7280" }}>Выкуп</div>
                <div style={{ flex: 1, height: 16, background: "#252830", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${selectedProduct.buyout}%`, height: "100%", background: selectedProduct.buyout < 60 ? "#ef444460" : "#10b98140", borderRadius: 3 }} />
                </div>
                <div style={{ width: 50, textAlign: "right", fontSize: 12, fontWeight: 600, color: selectedProduct.buyout < 60 ? "#ef4444" : "#10b981" }}>{pct(selectedProduct.buyout)}</div>
              </div>
            </div>

            {/* Hypothesis */}
            <div style={{ background: "linear-gradient(135deg, #1a1d27, #14201e)", borderRadius: 14, padding: 20, border: "1px solid #10b98130" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#10b981" }}>Гипотеза и рекомендация</h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d5db", margin: 0 }}>{selectedProduct.hypothesis}</p>
            </div>
          </div>
        )}

        {/* PLAN TAB */}
        {tab === "plan" && (
          <div>
            <div style={{ background: "linear-gradient(135deg, #1a1d27, #14201e)", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid #10b98130" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: "#10b981" }}>Потенциал: от −6 905 ₽ → до +40 000–55 000 ₽</h3>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
                Выполнение плана ниже может увеличить прибыль на 47–62К ₽ за аналогичный период.
              </p>
            </div>

            {[
              { priority: "1", title: "Немедленно остановить промо JBL 860 белый и синий", impact: "+35 500 ₽", color: "#ef4444",
                detail: "ДРР 54.6% и 37.6%. Два товара сжигают 42К рекламного бюджета, генерируя 25К убытка. Отключение рекламы — моментальный эффект." },
              { priority: "2", title: "Снизить ДРР на JBL Pro 5 чёрный до 10%", impact: "+25 000 ₽", color: "#f59e0b",
                detail: "197 заказов показывают сильный органический спрос. Текущие 57К на рекламу избыточны — товар продаётся и без неё. Снижение промо с 19% до 10% сэкономит ~27К." },
              { priority: "3", title: "Убрать Labubu и мыло из активных продаж", impact: "+1 100 ₽", color: "#6b7280",
                detail: "Labubu продаётся дешевле себестоимости. Мыло поштучно при комиссии 44.8% и логистике 20.4% — убыточно при любом промо." },
              { priority: "4", title: "Масштабировать Монталин и Эпимедиумную пасту", impact: "+5 000–8 000 ₽", color: "#10b981",
                detail: "Маржа 18.8% и 11.9% при минимальном ДРР. Увеличение промо-бюджета на эти товары в 2x принесёт дополнительные 5–8К при сохранении рентабельности." },
              { priority: "5", title: "Повысить выкуп Mass Former 20 капс", impact: "+5 000–7 000 ₽", color: "#3b82f6",
                detail: "Выкуп 56.3% — каждый второй заказ возвращается. Улучшить описание, добавить видео-обзоры, проверить соответствие фото/описания реальному товару. Каждые +5% выкупа = +7К прибыли." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#1a1d27", borderRadius: 12, padding: "16px 18px", marginBottom: 10, borderLeft: `3px solid ${item.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1117", background: item.color, borderRadius: 4, padding: "2px 7px" }}>{item.priority}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>{item.impact}</span>
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.6, paddingLeft: 30 }}>{item.detail}</p>
              </div>
            ))}

            <div style={{ background: "#1a1d27", borderRadius: 14, padding: 20, marginTop: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "#f9fafb" }}>Перераспределение рекламного бюджета</h4>
              <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 8px" }}>Текущий бюджет: <strong style={{ color: "#f59e0b" }}>157 961 ₽</strong> → предлагаемый: <strong style={{ color: "#10b981" }}>~80 000 ₽</strong> (экономия 78К)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#ef4444", marginBottom: 6 }}>Убрать / снизить:</div>
                    <div>JBL 860 белый: 31.5К → 0</div>
                    <div>JBL 860 синий: 10.7К → 0</div>
                    <div>JBL Pro 5 чёрный: 57.4К → 30К</div>
                    <div>Мыло: 1.5К → 0</div>
                    <div>Mass Former 40: 4.2К → 2К</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#10b981", marginBottom: 6 }}>Увеличить:</div>
                    <div>Монталин: 1.1К → 3К</div>
                    <div>Эпимедиумная паста: 4К → 8К</div>
                    <div>Витамин Д3 К2: 9.2К → 12К</div>
                    <div>JBL Pro 5 золотой: 17.7К → 15К</div>
                    <div>Mass Former 20: 12.2К → 10К</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
