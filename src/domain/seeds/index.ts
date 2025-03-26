
import { DataSource } from "typeorm";
import { APP_ENTITIES } from "../domain.module";
import { Category } from "../entities/category.entity";
import { Topic } from "../entities/topic.entity";
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.DB_HOST);

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: APP_ENTITIES,
    synchronize: false,
});

console.log(dataSource);

async function run() {
    const seed =
    {
        "Geología y Exploraciones": [
            "Geología económica de yacimientos minerales metálicos y no metálicos. Investigaciones geológicas, petro-mineralógicas, geofísicas y geoquímicas.",
            "Prevención, evaluación y mitigación de riesgos geológicos.",
            "Desarrollo y evolución de nuevas tecnologías para la exploración y desarrollo de proyectos.",
            "Aplicación de tecnologías emergentes: imágenes satelitales, hiperespectrales, machine learning, perfilaje de taladros de perforación (eléctricos, radioactivos, porosidad).",
            "Evolución de conceptos y modelos de yacimientos minerales. Posibilidades de descubrimiento de nuevos cinturones de mineralización en Perú.",
            "Minerales y metales para la transición energética: Políticas y estrategias para la exploración.",
            "Tecnologías digitales y de IA: Aplicaciones e impacto en las exploraciones, modelamiento y estimación de recursos. Exploración y cartografía autónomas en las operaciones mineras y alrededores.",
            "Interpretación y modelamiento de yacimientos.",
        ],
        "Procesamiento de Minerales y Metalurgia Extractiva": [
            "Mineralogía de procesos (geometalurgia).",
            "Pre-concentración de minerales.",
            "Optimización de operaciones y procesos en plantas.",
            "Reducción de tamaño en chancado y molienda y ahorro de energía.",
            "Flotación, gravimetría y separación magnética y electrostática.",
            "Procesos hidro-electrometalúrgicos.",
            "Procesos pirometalúrgicos.",
            "Operaciones de separación solido/liquido.",
            "Refinación de metales.",
            "Reutilización/Procesamiento de desechos de plantas metalúrgicas (escoria, residuos, relaves y polvos).",
            "Operaciones Mineras y Gestión de Activos",
            "Desarrollo de nuevos métodos de minado.",
            "Planeamiento de minado. ",
            "Gestión de mantenimiento.",
            "Servicios auxiliares. ",
            "Geotecnia / Geomecánica. ",
            "Mejora de procesos (Six Sigma, Lean Management, etc).",
        ],
        "ESG": [
            "Gestión del agua en operaciones y el entorno. ",
            "Pasivos ambientales y Cierre de Minas. ",
            "Gestión de residuos y economía circular. ",
            "Geoquímica Ambiental. ",
            "Emisión Cero y Riesgo Climático. ",
            "Permisología Ambiental. ",
            "Biodiversidad y Capital Natural.",
            "Nuevos enfoques en relacionamiento comunitario.",
            "Gestión de impactos y riesgos sociales.",
            "Responsabilidad social empresarial / valor compartido.",
            "Participación y diálogo efectivo.",
            "Gestión del territorio y desarrollo social.",
            "Derechos Humanos y pueblos indígenas.",
            "Gestión de Riesgos Críticos en Seguridad.",
            "Gestión del Comportamiento y su impacto en la Seguridad.",
            "Interrelación entre el Proceso Productivo y la Seguridad.",
            "Gestión de Riesgos del Negocio (Enterprise Risk Assessment).",
            "Sistema de Cumplimiento (Compliance).",
            "Buenas prácticas en la gestión de Valores y Código de Ética.",
        ],
        "Regulación y Economía Minera": [
            "Participación ciudadana aplicable a las actividades mineras.",
            "Uso de recursos públicos (canon, regalías y obras por impuestos).",
            "Incidencia tributaria en las distintas fases de un Proyecto Minero.",
            "Contingencias tributarias en el sector minero.",
            "Importancia del control y auditoria de plantas de procesamiento. ",
            "Mecanismos de solución de conflictos.",
            "Formalización de la pequeña minería y minería artesanal.",
            "Importancia de la minería en economías emergentes.",
            "Metales estratégicos para nuevas tecnologías.",
            "Valorización de proyectos mineros.",
            "Potencial minero regional.",
            "Impacto de la transición energética en la minería.",
            "Eficacia de la fiscalización en el sector minero.",
            "Impacto de los permisos en el desarrollo de Proyectos Mineros.",
            "Impacto negativo de la minería ilegal en la minería formal, economía peruana y la tributación.",
            "Mecanismos de financiamiento para el desarrollo minero y su impacto tributario.",
        ],
        "Minería 4.0": [
            "Tecnología e innovaciones en seguridad.",
            "Optimización de procesos en Minería con Analítica de datos (Aplicaciones de IA, Simulación y Gemelos Digitales, IOT).",
            "Cibeseguridad del manejo de sistemas de información en operaciones mineras.",
            "Sistemas de control e integración de operaciones.",
            "Automatización y nuevas tecnologías (Autonomía robotizada, Big Data, Cloud Computing, Realidad Aumentada, Fabricación Aditiva)."
        ]
    };

    const entries = Object.entries(seed);
    for (const [categoryName, topicNames] of entries) {
        console.log(`Inserting ${categoryName}`);
        const category: Category = {
            name: categoryName,
            createdAt: new Date(),
        };
        const categoryCreated = await dataSource.getRepository(Category).save(category);
        for (const topicName of topicNames) {
            console.log(`Inserting ${topicName}`);
            const topic: Topic = {
                name: topicName,
                category: categoryCreated,
                createdAt: new Date(),
            }
            await dataSource.getRepository(Topic).save(topic);
        }
    }
}

run()