import { Title, Text, Container, Group, Button } from '@mantine/core';
import { Metadata } from 'next';

import css from './not-found.module.css'

export const metadata: Metadata = {
    title: "Página no Encontrada | Crop Management System",
    description: "Página no Encontrada en Crop Management System",
};

export default function NotFound() {
    return (
        <Container className={css.root}>
            <div className={css.label}>404</div>
            <Title className={css.title}>You have found a secret place.</Title>
            <Text c="dimmed" size="lg" ta="center" className={css.description}>
                Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
                been moved to another URL.
            </Text>
            <Group justify="center">
                <Button variant="subtle" size="md">
                    Take me back to home page
                </Button>
            </Group>
        </Container>
    )
}