import axios from "axios";

function findAllCustomers() {
  return axios
    .get("http://localhost:8000/api/customers")
    .then((response) => response.data["hydra:member"]);
}

function deleteOneCustomer(id) {
  return axios.delete("http://localhost:8000/api/customers/" + id);
}

export default {
  findAll: findAllCustomers,
  delete: deleteOneCustomer,
};
