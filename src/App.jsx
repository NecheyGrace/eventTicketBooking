import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";
import TicketForm from "./components/TicketForm";

const App = () => {
  return (
    <BrowserRouter>
      <div className=" h-screen w-[100%] px-[120px] pt-[10px] bg-[#02191D] bg-[radial-gradient(52.52%_32.71%_at_50%_97.66%,rgba(36,160,181,0.20)_0%,rgba(36,160,181,0.00)_100%)]">
        <Header />
        <TicketForm />
      </div>
    </BrowserRouter>
  );
};

export default App;
