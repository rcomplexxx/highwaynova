import styles from "./policyCard.module.css";






export default function PolicyCard(props) {
  return (
    <div
      className={styles.policy_background_div}
    >
      <div
      className={styles.policy_main_div}
    >
        {props.children}
        </div>
    </div>
  );
}
