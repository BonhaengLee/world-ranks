import Head from "next/head";
import styles from "./Layout.module.css";

const Layout = ({ children, title = "world Ranks" }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className={styles.header}>
                <img src="send.svg" height={24} width={175} />
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>sjwdev @ devchallenges.io</footer>
        </div>
    );
};

export default Layout;
