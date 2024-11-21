const axios = require("axios");

const BITQUERY_API_URL = "https://streaming.bitquery.io/graphql";


exports.fetchWhaleTransfer = async () => {
    const query = `
    query MyQuery {
      EVM {
        Transfers(limit: {count: 10}) {
          Transaction {
            From
            To
            Hash
            Value(minimum: Transfer_Id, selectWhere: {gt: "100000"})
          }
        }
      }
    }
  `;
  

    try {
        const response = await axios.post(
            BITQUERY_API_URL,
            { query },
            { headers: { "X-API-KEY": "BQYeaciV1rkAnTsdajPmQmrhxyhDBuxn" } }
        );
        console.log(response.data.data, "response")
        return response.data.data.EVM.Transfers;
    } catch (error) {
        console.error("Error fetching whale accounts:", error.message);
        return [];
    }
}
