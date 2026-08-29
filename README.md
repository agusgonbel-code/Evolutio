# Evolutio

Repositorio oficial de Evolutio.

## Objetivo
Aplicación fitness profesional con entrenamiento, nutrición, recetas, seguimiento y planificación basada en evidencia.

## Estado inicial de este repositorio
Este repositorio se ha creado limpio para separar Evolutio de FitCoach, Recomp10 y el resto de proyectos.

La primera prioridad técnica es estabilizar Nutrición y asegurar cálculos reproducibles de macronutrientes.

### Regla de cálculo nutricional
Los nutrientes de cada ingrediente se calculan como:

`cantidad_g / 100 * nutriente_por_100g`

No se redondean resultados intermedios; solo se redondea para mostrar al usuario.

Además, el estado del alimento debe ser explícito (seco/crudo/cocido) para evitar mezclar valores. Por ejemplo, un arroz seco configurado a 70 g de carbohidratos por 100 g debe producir 290.5 g de carbohidratos para 415 g.

## Próximos hitos
- Nutrición sin bloqueos con datos vacíos, parciales o completos.
- Persistencia local robusta y tolerante a datos antiguos.
- Motor de macros y recetas con pruebas.
- Menús y recetas enlazados.
- Entrenamiento basado en evidencia y cobertura muscular completa.
- QA y despliegue verificable.
