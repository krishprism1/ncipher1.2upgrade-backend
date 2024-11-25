import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../views/footer";
import axios from "axios";

function Transactions() {
  const [data, setData] = useState();
  const [load, setLoad] = useState(false);
  const [intervalInMinutes, setIntervalInMinutes] = useState(0); // Default interval in minutes
  const [countdown, setCountdown] = useState(intervalInMinutes); // Countdown in seconds
  const [timerId, setTimerId] = useState(null); // Store interval ID for clearing
  const [countdownId, setCountdownId] = useState(null); // Countdown timer ID

  useEffect(() => {
    fetchTx(); // Initial API call
  }, []);

  useEffect(() => {
    setCountdown(intervalInMinutes); 
  }, [intervalInMinutes]);

  const fetchTx = async () => {
    setLoad(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bitquery/transaction"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoad(false);
    }
  };

  const handleSetInterval = () => {
    if (timerId) clearInterval(timerId);
    if (countdownId) clearInterval(countdownId);

    const intervalInMilliseconds = intervalInMinutes * 1000;

    const id = setInterval(() => {
      fetchTx();
    }, intervalInMilliseconds);
    setTimerId(id);

    const countdownTimerId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return intervalInMinutes;
        }
        return prev - 1;
      });
    }, 1000);
    setCountdownId(countdownTimerId);
  };

  function shortenAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 7)}...${address.slice(-5)}`;
  }

  return (
    <div id="transactions">
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>

        <div className="w-1/2 mb-8">
          <label htmlFor="interval" className="block text-lg font-medium mb-2">
            Enter the interval in minutes
          </label>
          <input
            id="interval"
            type="number"
            placeholder="1"
            className="w-full px-4 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={intervalInMinutes}
            onChange={(e) => setIntervalInMinutes(e.target.value)}
          />
          <button
            onClick={handleSetInterval}
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold transition duration-300"
          >
            Set Interval
          </button>
          <p className="text-sm mt-2">
            Next refresh in{" "}
            <span className="text-green-400">{countdown} seconds</span>
          </p>
        </div>

        <div className="overflow-x-auto w-3/4">
          <table className="w-full table-auto border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2 text-left">Hash</th>
                <th className="border border-gray-700 px-4 py-2 text-left">Amount</th>
                <th className="border border-gray-700 px-4 py-2 text-left">Sender</th>
                <th className="border border-gray-700 px-4 py-2 text-left">To</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length && !load ? (
                data.map((item, index) => (
                  <tr
                    className="hover:bg-gray-800 transition duration-200"
                    key={index}
                  >
                    <td className="border border-gray-700 px-4 py-2">
                      {shortenAddress(item?.Transaction?.Hash)}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {parseFloat(item?.Transaction?.Value).toFixed(4)} BNB
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {shortenAddress(item?.Transaction?.From)}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {shortenAddress(item?.Transaction?.To)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-700 px-4 py-2 text-center"
                  >
                    {load ? "Loading..." : "No Data Available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Transactions;
