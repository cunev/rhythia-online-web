// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/copyright`
  | `/leaderboards`
  | `/maps`
  | `/maps/:id`
  | `/maps/criteria`
  | `/maps/find`
  | `/maps/upload`
  | `/player`
  | `/player/:id`
  | `/score/:id`

export type Params = {
  '/maps/:id': { id: string }
  '/player/:id': { id: string }
  '/score/:id': { id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
