
// import scssStyle from './app.less';
import scssStyles from './app.scss';
import img1 from "./assets/imgs/wxxcx.png";
// 配合tsconfig的resolveJsonModule使用
import testJson from "./test.json"


const App = () => {
    return (
        <div className={scssStyles['scssBox']}>
            <div className={scssStyles['box']}>scssBox</div>
            <img src={img1} />
        </div>
    )
};

export default App;