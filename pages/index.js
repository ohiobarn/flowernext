import Link from "next/link"
import Image from "next/image";
import styles from "../styles/Home.module.css"

export default function Home() {
  return (
    <div>
      <div className={styles.splash}>
        <Image src="/splash-clear-bg.png" alt="" width={406} height={173} />
      </div>
      {/* <p className={styles.text}>Say something here.</p> */}
      <Link href='/orders'><a className={styles.btn}>Get Started</a></Link>
    </div>
  );
}
