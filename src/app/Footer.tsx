export default function Footer() {
    return (
        <footer className="bg-neutral p-10 text-neutral-content">
            <div className="footer m-auto max-w-7xl">
                <div>
                    <span className="footer-title">Services</span>
                    <a className="link-hover link">Branding</a>
                    <a className="link-hover link">Design</a>
                    <a className="link-hover link">Marketing</a>
                    <a className="link-hover link">Advertisement</a>
                </div>
                <div>
                    <span className="footer-title">Company</span>
                    <a className="link-hover link">About Us</a>
                    <a className="link-hover link">Contact</a>
                    <a className="link-hover link">Jobs</a>
                    <a className="link-hover link">Press Kit</a>
                </div>
                <div>
                    <span className="footer-title">Legal</span>
                    <a className="link-hover link">Terms of use</a>
                    <a className="link-hover link">Privacy Policy</a>
                    <a className="link-hover link">Cookie Policy</a>
                    <a className="link-hover link">Advertisement</a>
                </div>
            </div>
        </footer>
    );
}