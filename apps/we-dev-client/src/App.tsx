import AiChat from "./components/AiChat";
import "./utils/i18";
import classNames from "classnames";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useInit from "./hooks/useInit";
import {Loading} from "./components/loading";
import AuthWrapper from "./components/AuthWrapper";
import RouteValidator from "./components/RouteValidator";

function App() {
    const {isDarkMode} = useInit();

    return (
        <AuthWrapper>
            <RouteValidator>
                <div
                    className={classNames(
                        "h-screen w-screen flex flex-col overflow-hidden",
                        {
                            dark: isDarkMode,
                        }
                    )}
                >
                    <div className="flex flex-row w-full h-full bg-white dark:bg-[#111]">
                        <AiChat/>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    style={{
                        zIndex: 100000,
                    }}
                />
                <Loading/>
            </RouteValidator>
        </AuthWrapper>
    );
}

export default App;
