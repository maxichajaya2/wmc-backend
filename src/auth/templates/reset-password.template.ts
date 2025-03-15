export function getResetPasswordTemplate(token: string){
    const url = `${process.env.APP_URL}/reset-password?token=${token}`;
    const template = `
        <h1>Resetear contraseña</h1>
        <p>Click <a href="${url}">aquí</a> para resetear tu contraseña</p>
    `;
    return template;
}