export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            //src="/images/logo.png"
            src="/Duantt/public/images/logo.png"
            alt="Logo dự án" 
            className="h-16 w-auto mix-blend-multiply"
            style={{ maxHeight: '100%' }}
        />
    );
}
