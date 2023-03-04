import { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.css";

interface Props {
  message: string
}

const user = null;

const Home: NextPage = (props: Props) => {

  return (
    <div>
      <h1 className={styles.title}>{props.message}</h1>
      {user && (
        <>
          <p>Currently logged in as:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
      <p className={styles.text}>Dolore sint sint duis minim. Eu nostrud incididunt culpa aute dolore ea tempor est ad adipisicing occaecat dolor amet aliqua. Irure aliquip elit amet aliquip commodo sint dolor. Deserunt laborum cupidatat irure ea exercitation reprehenderit labore.</p>
      <p className={styles.text}>Qui irure exercitation nulla in ex eu amet amet elit deserunt sint. Commodo id ad dolor velit dolor irure ex officia aute non non incididunt aute laboris. Irure quis culpa duis ullamco. Sunt ullamco sint exercitation excepteur laboris nisi dolor qui adipisicing aute ad. Laboris esse tempor ea pariatur eu culpa eu sunt dolore.</p>
      <Link className={styles.btn} href="/users">
        Check Users list
      </Link>
    </div>
  );
}


export async function getServerSideProps(context) {
  //const response = await fetch(`http://backend:8080/user`);
  //const body = await response.text(); //
  const body = "Homepage"
  return {
    props: {
      message: body
    }
  }
}


export default Home