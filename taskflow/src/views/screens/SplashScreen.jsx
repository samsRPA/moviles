export default function SplashScreen() {
  return (
    <div className="splash">
      {/* <div className="sp-logo">✅</div> */}
      <img src="./taskflow.jpeg" 
        alt="Logo de TaskFlow" 
        className="logo-img" 
        style={{ 
          width: '100px', 
          height: 'auto',
          borderRadius: '15px',
          }} />
      <div className="sp-name">TaskFlow</div>
      <div className="sp-tag">Tu día, organizado.</div>
      <div className="sp-bar-wrap">
        <div className="sp-bar" />
      </div>
    </div>
  );
}
