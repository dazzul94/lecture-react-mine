// 어플리케이션의 진입점(자바스크립트 코드의 시작점)
// 코드를 모듈별로 임포트해서 사용할 예정

// 리액트 엘리먼트의 attribute는 CamelCase로 쓴다 예를 들어 onclick => onClick
// class는 예약어이기 때문에 className을 사용한다.

import { formatRelativeDate } from "./js/helpers.js";
import store from "./js/Store.js";

const TabType = {
  KEYWORD: 'KEYWORD',
  HISTORY: 'HISTORY'
}

const TabLabel = {
  [TabType.KEYWORD]: '추천 검색어',
  [TabType.HISTORY]: '최근 검색어'
}

// 리액트 컴포넌트 class를 만들어준다. (엘리먼트를 클래스로)
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      searchKeyword: "",  // 입력값을 나타내는 상태
      searchResult: [],
      submitted: false,
      selectedTab: TabType.KEYWORD,
      keywordList: [],
      historyList: [],
    }
  }

  componentDidMount() {
    const keywordList = store.getKeywordList();
    const historyList = store.getHistoryList();

    this.setState({ 
      keywordList, 
      historyList 
    });
  }

  handleChangeInput(event) {  // 인풋 상태를 리액트 컴포넌트가 관리하게 한다.
    // this.state.searchKeyword = event.target.value;
    // this.forceUpdate(); // 강제 상태변경
    // 리액트 컴포넌트가 스스로 state변경 값을 변경했다는 것을 알고 랜더링하게끔 setState
    const searchKeyword = event.target.value;

    if(searchKeyword.length <= 0 && this.state.submitted) { // 입력한 검색어가 "" 이고, 검색결과가 true일때
      return this.handleReset();  // handleReset에서 상태값 관리하고 있기 때문에 그냥 리턴
    }
    this.setState({
      searchKeyword: event.target.value,
    })
  }

  handleSubmit(event) {
    event.preventDefault();   // form 의 기본동작 막기
    // 검색 수행
    this.search(this.state.searchKeyword);
  }

  search(searchKeyword) {
    const searchResult = store.search(searchKeyword);

    // 최근 검색어 추가
    store.addHistory(searchKeyword);
    const historyList = store.getHistoryList();

    this.setState({
      searchKeyword,
      searchResult,
      submitted: true,
      historyList,
    });
  }

  handleReset() {
    // this.setState({ searchKeyword : ""}); // setState는 비동기 함수이다. 바로 반영되지 않는다.
    // console.log('TODO: handleReset', this.state.searchKeyword);

    this.setState(() => {
      // 변경하려는 상태를 반환
      return { 
        searchKeyword : "",
        searchResult: [],
        submitted: false,
      }
    }, () => {
      // 업데이트 완료 후 콜백함수
      console.log('TODO: handleReset', this.state.searchKeyword);
    })
  }

  handleClickRemoveHistory(event, keyword) {
    event.stopPropagation();  // 이벤트 버블링 막기(자식요소에서 버블링 막으면 됨)
    store.removeHistory(keyword);

    const historyList = store.getHistoryList();
    this.setState({historyList});
  }

  render() {
    // let resetButton = null;

    // 1. 엘리먼트를 만들어서 넣어준다.
    // if(this.state.searchKeyword.length > 0) {
    //   resetButton = <button type="reset" className="btn-reset"></button>;
    // }

    const searchForm = (
      <form 
            onSubmit={event => this.handleSubmit(event)}
            onReset={() => this.handleReset()}>
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              autoFocus 
              value={this.state.searchKeyword} 
              onChange={event => this.handleChangeInput(event)} />
            {/* 1. 엘리먼트를 만들어서 버튼으로 대체 */}
            {/* {resetButton} */}
            {/* 삼항연산자로 표현 */}
            {/* null은 표현하지 않는다 리액트에서 */}
            {/* {this.state.searchKeyword.length > 0 ? <button type="reset" className="btn-reset"></button> : null} */}
            {/* && 로 표현( 첫번째조건이 참이면 두번째 조건을 실행한다 */}
            {(this.state.searchKeyword.length > 0) && <button type="reset" className="btn-reset"></button>}
          </form>
    )

    const searchResult = (
      this.state.searchResult.length > 0 ? (
        <ul className="result">
          {this.state.searchResult.map((item, index) => {
            return (
              <li key={item.id}>
                <img src={item.imageUrl} alt={item.name}></img>
                <p>{item.name}</p>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="empty-box">검색 결과가 없습니다</div>
    ));

    const keywordList = (
      <ul className="list">
        {this.state.keywordList.map(({id, keyword}, index) => {
          return (
            <li 
              key={id}
              onClick={() => this.search(keyword)}
              >
              <span className="number">{index + 1}</span>
              <span>{keyword}</span>
            </li>
          )
        })}
      </ul>
    );

    const historyList = (
      <ul className="list">
        {this.state.historyList.map(({id, keyword, date}, index) => {
          return (
            <li 
              key={id}
              onClick={() => this.search(keyword)}>
              <span>{keyword}</span>
              <span className="date">{formatRelativeDate(date)}</span>
              <button 
                className="btn-remove"
                onClick={event => this.handleClickRemoveHistory(event, keyword)}
              >
              </button>
            </li>
          )
        })}
      </ul>
    )

    const tabs = (
      <>
        <ul className="tabs">
          {Object.values(TabType).map(tabType => {
            return (
              <li 
                key={tabType}
                onClick={() => this.setState({selectedTab : tabType})}
                className={this.state.selectedTab === tabType ? 'active' : ''}>
                {TabLabel[tabType]}
              </li>
            )
          })}
        </ul>
        {this.state.selectedTab === TabType.KEYWORD && keywordList}
        {this.state.selectedTab === TabType.HISTORY && historyList}
      </>
    );

    return (
      <>
        <header>
          <h2 className="container">검색</h2>
        </header>
        <div className="container">
          {searchForm}
          <div className="content">
            {/* empty-box 보여줘야하니까 삼항연산자로 표현 */}
            {this.state.submitted ? searchResult : tabs}
          </div>
        </div>
      </>
    )  
  }
}
// <App /> 으로 쓰고 리액트 컴포넌트 객체로 넘겨준다
ReactDOM.render(<App />, document.querySelector("#app"));