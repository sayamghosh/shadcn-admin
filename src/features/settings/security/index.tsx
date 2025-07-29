import ContentSection from '../components/content-section'
import ChangePasswordForm from './change-password-form'

export default function SettingsChangePassword() {
  return (
    <ContentSection
      title='Security'
      desc='Change your password and manage security settings.'
    >
      <ChangePasswordForm />
    </ContentSection>
  )
}
