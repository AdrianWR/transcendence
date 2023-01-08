import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 3000)
    }, [router])

    return (
        <div className="not-found">
            <h1>Ooops...</h1>
            <h2>This page cannot be found.</h2>
            <p>Go back to the <Link href="/">Homepage</Link></p>
        </div>
    );
}

import { Button, Container, Image, SimpleGrid, Text, Title, createStyles } from '@mantine/core';
import { NextPageWithLayout } from "./_app";
import image from '/public/images/404.svg';

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },

    title: {
        fontWeight: 900,
        fontSize: 34,
        marginBottom: theme.spacing.md,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    control: {
        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },

    mobileImage: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    desktopImage: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
}));

const NotFoundWithImage: NextPageWithLayout = () => {
    const { classes } = useStyles();
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 15000)
    }, [router])


    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
                <Image src={image} className={classes.mobileImage} />
                <div>
                    <Title className={classes.title}>Something is not right...</Title>
                    <Text color="dimmed" size="lg">
                        Page you are trying to open does not exist. You may have mistyped the address, or the
                        page has been moved to another URL. If you think this is an error contact support.
                    </Text>
                    <Link href="/">
                        <Button variant="outline" size="md" mt="xl" className={classes.control}>
                            Get back to home page
                        </Button>
                    </Link>
                </div>
                <Image src={image.src} className={classes.desktopImage} />
            </SimpleGrid>
        </Container>
    );
}

export default NotFoundWithImage