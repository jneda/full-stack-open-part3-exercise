import Person from "./Person";

const NumbersDisplay = ({ persons, handleDeletionFor }) => {
  return (
    <>
      <h3>Numbers</h3>
      <ul>
        {persons.map((person) => (
          <Person
            key={person.name}
            person={person}
            handleDeletion={() => handleDeletionFor(person.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default NumbersDisplay;
