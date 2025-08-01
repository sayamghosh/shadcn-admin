import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { BASE_URL } from '@/lib/urls'

// import { set } from 'zod'
// import { userListSchema } from './data/schema'
// import { users } from './data/users'

export default function Users() {
  // Parse user list
  // const userList = userListSchema.parse(users)
  const { accessToken } = useAuthStore((state) => state.auth)
  const [userList, setUserList] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasNext, setHasNext] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch(
        `${BASE_URL}/api/users?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=-1`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      const response = await res.json()
      setUserList(response.data)
      setHasNext(response.hasNext)
      setTotalCount(response.totalCount)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  function fetchNextPage(n:number) {
    if (n < 0 && page <= 1) return // Prevent going to previous page if already on first page
    if (n > 0 && !hasNext) return // Prevent going to next page
    setPage((prevPage) => prevPage + n)
  }

  function changeLimit(newLimit: number) {
    setLimit(newLimit)
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable
            data={userList}
            columns={columns}
            fetchNextPage={fetchNextPage}
            hasNext={hasNext}
            totalCount={totalCount}
            page={page}
            changeLimit={changeLimit}
            loading={loading}
          />
        </div>
      </Main>
      <UsersDialogs />
    </UsersProvider>
  )
}
