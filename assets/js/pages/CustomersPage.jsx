import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  //Get the list of customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  //On load of the component get customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Manage deleting of one customer
  const handleDelete = async (id) => {
    const originalCustomers = [...customers];
    setCustomers(customers.filter((customer) => customer.id !== id));

    try {
      await CustomersAPI.delete(id);
    } catch (error) {
      setCustomers(originalCustomers);
    }
  };

  //Manager page changed
  const handlePageChanged = page => setCurrentPage(page);


  //Manager search
  const handleSearch = ({currentTarget}) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };


  //Filter customer according to search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      (customer.company &&
        customer.company.toLowerCase().includes(search.toLowerCase()))
  );

  //paginating of data
  const paginatedCustomer = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des clients</h1>
      <div className="form-group">
        <input
          className="form-control"
          onChange={handleSearch}
          value={search}
          placeholder="Rechercher..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}
          {!loading &&
            paginatedCustomer.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-primary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()}€
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChanged}
        />
      )}
    </>
  );
};

export default CustomersPage;
