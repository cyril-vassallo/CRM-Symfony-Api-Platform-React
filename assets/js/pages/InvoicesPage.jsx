import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";

const STATUS_CLASSES = {
  SENT: "primary",
  CANCELLED: "danger",
  PAID: "success",
};
  
const STATUS_LABELS = {
  SENT: "Envoyée",
  CANCELLED: "Annulée",
  PAID: "Payée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Get the list of Invoices
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  //On load of the component get Invoice
  useEffect(() => {
    fetchInvoices();
  }, []);

  //Manage deleting of one Invoice
  const handleDelete = async (id) => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter((invoice) => invoice.id !== id));

    try {
      await InvoiceAPI.delete(id);
    } catch (error) {
      setInvoices(originalInvoices);
    }
  };

  //Manager page changed
  const handlePageChanged = page => setCurrentPage(page);


  //Manager search
  const handleSearch = ({currentTarget}) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  //Filter Invoice according to search
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
  );

  //paginating of data
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  const formatDate = (str) => moment(str).format("DD/MM/YYYY");


  return (
    <>
      <h1>Liste des Factures</h1>
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
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}
          {!loading &&
            paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <a href="#">
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </a>
                </td>
                <td className="text-center">
                  {formatDate(invoice.sentAt)}
                </td>
                <td className="text-center">
                  <span className={"badge badge-"+ STATUS_CLASSES[invoice.status] }>
                    {STATUS_LABELS[invoice.status]}
                  </span>
                </td>
                <td className="text-right">{invoice.amount.toLocaleString()} €</td>
                <td>
                  <button className="btn btn-sm btn-primary m-1">
                    Editer
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChanged={handlePageChanged}
        />
      )}
    </>
  );
};

export default InvoicesPage;
