export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/Duantt/public/images/logo.png"
            alt="Logo dự án" 
            className="h-20 w-auto mix-blend-multiply"
            style={{ maxHeight: '100%' }}
        />
    );
}
