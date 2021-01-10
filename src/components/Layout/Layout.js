import Head from "next/head";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
                <img src="send.svg" height={24} width={175} />
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>footer</footer>
        </div>
    );
};

export default Layout;
