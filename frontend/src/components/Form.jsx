import Input from "./Input";

const Form = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <>
      <h3>Add new</h3>
      <form onSubmit={addPerson}>
        <Input label="name:" value={newName} onChange={handleNameChange} />
        <Input
          label="number:"
          value={newNumber}
          onChange={handleNumberChange}
        />
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  );
};

export default Form;
