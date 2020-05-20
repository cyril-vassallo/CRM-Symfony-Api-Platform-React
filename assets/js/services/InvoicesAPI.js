import axios from "axios";

function findAllInvoices() {
  return axios
    .get("http://localhost:8000/api/invoices")
    .then((response) => response.data["hydra:member"]);
}

function deleteOneInvoices(id) {
  return axios.delete("http://localhost:8000/api/invoices/" + id);
}

export default {
  findAll: findAllInvoices,
  delete: deleteOneInvoices
};
