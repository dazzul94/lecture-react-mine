// 어플리케이션의 진입점(자바스크립트 코드의 시작점)
// 코드를 모듈별로 임포트해서 사용할 예정

// 리액트 엘리먼트의 attribute는 CamelCase로 쓴다 예를 들어 onclick => onClick
// class는 예약어이기 때문에 className을 사용한다.
const element = (
  <header>
    <h2 className="container">검색</h2>
  </header>
);
ReactDOM.render(element, document.querySelector("#app"));