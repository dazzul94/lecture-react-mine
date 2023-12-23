// 어플리케이션의 진입점(자바스크립트 코드의 시작점)
// 코드를 모듈별로 임포트해서 사용할 예정

// 리액트 엘리먼트의 attribute는 CamelCase로 쓴다 예를 들어 onclick => onClick
// class는 예약어이기 때문에 className을 사용한다.

// 리액트 컴포넌트 class를 만들어준다. (엘리먼트를 클래스로)
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      searchKeyword: "",  // 입력값을 나타내는 상태
    }
  }

  handleChangeInput(event) {  // 인풋 상태를 리액트 컴포넌트가 관리하게 한다.
    // this.state.searchKeyword = event.target.value;
    // this.forceUpdate(); // 강제 상태변경
    // 리액트 컴포넌트가 스스로 state변경 값을 변경했다는 것을 알고 랜더링하게끔 setState
    this.setState({
      searchKeyword: event.target.value,
    })
  }

  render() {
    return (
      <>
        <header>
          <h2 className="container">검색</h2>
        </header>
        <div className="container">
          <form>
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              autoFocus 
              value={this.state.searchKeyword} 
              onChange={event => this.handleChangeInput(event)} />
            <button type="reset" className="btn-reset"></button>
          </form>
        </div>
      </>
    )  
  }
}
// <App /> 으로 쓰고 리액트 컴포넌트 객체로 넘겨준다
ReactDOM.render(<App />, document.querySelector("#app"));