import styles from "./policyCard.module.css";

export function PolicyMiniCard(props) {
  return (
    <div
      className={`${styles.policy_main_div} ${
        props.homeCard ? styles.homeCard : ""
      }`}
    >
      {props.children}
    </div>
  );
}

export default function PolicyCard(props) {
  return (
    <div
      className={`${styles.policy_background_div} ${
        props.smallContent && styles.bigBackDiv
      }`}
    >
      <PolicyMiniCard homeCard={props.homeCard}>
        {props.children}
      </PolicyMiniCard>
    </div>
  );
}
