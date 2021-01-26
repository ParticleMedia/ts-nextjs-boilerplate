import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { GetServerSidePropsResult } from 'next';
import styles from '../styles/Home.module.scss';

type componentProps = {
  name: string;
};
type notFoundResult = {
  notFount: boolean;
};
export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<componentProps | notFoundResult>
> {
  const res = await fetch(`http://localhost:3000/api/hello`);
  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      name: data.name,
    }, // will be passed to the page component as props
  };
}

const Home = ({ name }: componentProps) => (
  <Container maxWidth="md">
    <Box className={styles.box} my={8}>
      <Typography variant="h4" component="h1" gutterBottom>
        {name}
      </Typography>{' '}
    </Box>
  </Container>
);

export default Home;
