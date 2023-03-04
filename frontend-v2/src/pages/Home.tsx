import { Button } from '@mantine/core';
import { FC, useState } from 'react';

const user = null;

const Home: FC = () => {
  const [message, setMessage] = useState(0);

  const getMessage = () => {
    console.log(message);
    setMessage(message + 1);
  };

  return (
    <div>
      <h1>HomePage</h1>
      {user && (
        <>
          <p>Currently logged in as:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
      <p>
        Dolore sint sint duis minim. Eu nostrud incididunt culpa aute dolore ea tempor est ad
        adipisicing occaecat dolor amet aliqua. Irure aliquip elit amet aliquip commodo sint dolor.
        Deserunt laborum cupidatat irure ea exercitation reprehenderit labore.
      </p>
      <p>
        Qui irure exercitation nulla in ex eu amet amet elit deserunt sint. Commodo id ad dolor
        velit dolor irure ex officia aute non non incididunt aute laboris. Irure quis culpa duis
        ullamco. Sunt ullamco sint exercitation excepteur laboris nisi dolor qui adipisicing aute
        ad. Laboris esse tempor ea pariatur eu culpa eu sunt dolore.
      </p>
      <p>This is the new number: {message}</p>

      <Button onClick={getMessage}>Hot Reload!!!</Button>
    </div>
  );
};

export default Home;
