function Home(props) {
  return (
    <h1>{props.message}</h1>
  );
}
export default Home

export async function getServerSideProps(context) {
  const response = await fetch(`http://backend:8080/user`);
  const body = await response.text(); //
  return {
    props: {
      message: body
    }
  }
}
