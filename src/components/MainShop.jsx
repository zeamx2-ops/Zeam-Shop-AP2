import React, { useState } from "react";
import PackageModal from "./PackageModal";
import { FaGem, FaCrown, FaStar } from "react-icons/fa";

const packages = [
  { name: "100 جواهر", price: 15, icon: <FaGem color="#1976d2" size={32}/> },
  { name: "500 جواهر", price: 75, icon: <FaGem color="#1976d2" size={32}/> },
  { name: "عضوية أسبوعية", price: 120, icon: <FaStar color="#4caf50" size={32}/> },
  { name: "عضوية شهرية", price: 340, icon: <FaCrown color="#fbc02d" size={32}/> }
];

function MainShop() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="main-shop">
      <div className="shop-global-note">
        <b>تنويه:</b> المتجر متوفر فقط لدول الشرق الأوسط وشمال أفريقيا · الدفع حصري عبر أوريدو (يبدأ بـ 05)
      </div>
      <div className="header-shop">
        <img src="/logo192.png" alt="logo" className="shop-logo" />
        <div>
          <h1>Zeam-Shop v1</h1>
          <p className="slogan">وجهتك الآمنة لشحن جواهر فري فاير في الجزائر فقط</p>
        </div>
      </div>
      <div className="trust-row">
        <span>موثوقية وأمان كامل</span> · <span>دعم فوري</span> · <span>أسعار تنافسية</span>
      </div>
      <div className="packages">
        {packages.map((p, i) => (
          <div key={i} className="package" onClick={() => setSelected(p)}>
            <div className="pkg-icon">{p.icon}</div>
            <div className="pkg-name">{p.name}</div>
            <div className="pkg-price">السعر: <b>{p.price} DZD</b></div>
          </div>
        ))}
      </div>
      {selected && (
        <PackageModal
          pack={selected}
          onClose={() => setSelected(null)}
        />
      )}
      <div className="whyus">
        <h4>لماذا نحن؟</h4>
        <ul>
          <li>دفع حصري عبر أوريدو بسرعة وسهولة</li>
          <li>سرعة تنفيذ الطلبات والدعم الفوري عبر تيليجرام</li>
          <li>بياناتك محمية بتقنيات تشفير متقدمة</li>
          <li>فريق موثوق وخبرة منذ 2023</li>
        </ul>
      </div>
      <div className="footer-note">
        جميع الحقوق محفوظة © Zeam-Shop 2025
      </div>
    </div>
  );
}

export default MainShop;