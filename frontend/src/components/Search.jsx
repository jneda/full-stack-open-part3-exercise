import Input from "./Input";

const Search = ({ filter, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Input
      label="filter shown with"
      value={filter}
      onChange={handleFilterChange}
    />
  );
};

export default Search;
