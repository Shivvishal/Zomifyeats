import classes from './inputContainer.module.css';
export default function InputContainer({label, bgcolor, children}){
    return(
        <div className={classes.container} style={{backgroundColor: bgcolor}}>
            <label className={classes.label}>{label}</label>
            <div className={classes.content}>{children}</div>
        </div>
    );
}