const Person = ({ person, handleDeletion }) => {
  const { name, number } = person;
  return (
    <li>
      {name} {number}
      <button onClick={handleDeletion}>delete</button>
    </li>
  );
};

export default Person;
