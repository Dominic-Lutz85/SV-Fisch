/**
 * Die Satzung des Sportvereins Fisch 1964 e.V., Stand 25.11.2022.
 *
 * WORTGETREU. Das hier ist kein Text, den man beim Einbauen glattzieht: Er
 * ist von der Mitgliederversammlung beschlossen, und was auf der Seite steht,
 * muss mit dem beschlossenen Wortlaut uebereinstimmen. Drei Stellen im
 * Original sehen nach Tippfehler aus ("Sitzung" in der Ueberschrift von § 1,
 * "Öffentlche" in § 7, "Mitgliedsversammlung" neben "Mitgliederversammlung"
 * in § 4). Sie bleiben stehen. Korrigieren darf sie nur die naechste
 * Mitgliederversammlung, nicht die Website.
 *
 * Vorher stand an dieser Stelle ein erfundenes Geruest aus acht Paragraphen
 * "auf Basis ueblicher Vereinssatzungen". Es hatte mit dieser Satzung wenig
 * gemein: falsche Anzahl, falsche Reihenfolge, falsche Inhalte.
 *
 * Quelle: Satzung-SV-Fisch_25112022.pdf, liegt als Download unter
 * public/satzung-sv-fisch-2022.pdf.
 *
 * Ein Absatz ist ein String. Eine nummerierte Aufzaehlung ist ein Objekt mit
 * `liste`, denn die Satzung zaehlt an vier Stellen durch, und eine Aufzaehlung
 * als Fliesstext mit "1." davor waere fuer einen Screenreader keine.
 */

export type SatzungsAbsatz = string | { liste: string[] };

export interface SatzungsParagraph {
  titel: string;
  absaetze: SatzungsAbsatz[];
}

export const SATZUNG_STAND = "25.11.2022";
export const SATZUNG_PDF = "/satzung-sv-fisch-2022.pdf";

export const satzung: SatzungsParagraph[] = [
  {
    titel: "§ 1 – Name, Sitzung, Eintragung und Geschäftsjahr",
    absaetze: [
      "Der Verein führt den Namen: Sportverein Fisch 1964 e.V.",
      "Der Verein hat seinen Sitz in Fisch. Er ist in das Vereinsregister beim Amtsgericht Wittlich eingetragen.",
      "Geschäftsjahr ist das Kalenderjahr.",
    ],
  },
  {
    titel: "§ 2 – Gemeinnützigkeit und Zweck des Vereins",
    absaetze: [
      "Der Verein ist selbstlos tätig und verfolgt ausschließlich und unmittelbar gemeinnützige Zwecke im Sinne des Abschnittes „Steuerbegünstigte Zwecke“ der Abgabenordnung in der jeweils gültigen Fassung und zwar insbesondere durch die Pflege und Förderung der Leibesübungen nach den Grundsätzen des Amateur-, Freizeit- und Breitensports. Der Verein fördert insbesondere die allgemeine Jugendarbeit und den Jugendsport. Der Verein ist Mitglied des Fußballverbandes Rheinland e.V.",
      "Etwaige Gewinne dürfen nur für die satzungsmäßigen Zwecke verwendet werden. Es darf keine Person durch Verwaltungsaufgaben, die den Zwecken des Vereins fremd sind, oder durch unverhältnismäßig hohe Vergütungen begünstigt werden. Ausscheidende Mitglieder haben gegen den Verein keinerlei Anspruch am Vereinsvermögen.",
      "Der Verein ist parteipolitisch neutral und steht Menschen aller Konfessionen und Nationen offen.",
    ],
  },
  {
    titel: "§ 3 – Mitgliedschaft",
    absaetze: [
      "Mitglied des Vereins kann jede natürliche und juristische Person werden.",
      "Der Verein besteht aus ordentlichen Mitgliedern, jugendlichen Mitgliedern und Ehrenmitgliedern. Als ordentliches Mitglied gelten Erwachsene beiderlei Geschlechts, die das 18. Lebensjahr vollendet haben. Zur Vereinsjugend zählen alle Mitglieder männlichen und weiblichen Geschlechts von der Geburt bis zum 18. Lebensjahr.",
      "Den Mitgliedern stehen die Anlagen und Gerätschaften des Vereins zur Benutzung zur Verfügung. Jedes Mitglied kann in allen Abteilungen des Vereins Sport betreiben. Den Anordnungen der technischen Leitung und deren Unterorgane ist Folge zu leisten.",
      "Personen, die sich um die Sache des Sports oder den Verein verdient gemacht haben, können geehrt werden. Das Nähere regelt eine Ehrenordnung.",
      "Wer die Mitgliedschaft erwerben will, hat an den Vorstand ein schriftliches Aufnahmegesuch zu stellen. Bei Minderjährigen ist die Unterschrift des gesetzlichen Vertreters als Zustimmung hierzu abzugeben. Über die Aufnahme entscheidet der Vorstand. Er ist nicht verpflichtet, dem Antragsteller die Gründe einer evtl. Ablehnung anzugeben.",
      "Die Mitgliedschaft erlischt durch Tod, freiwilligen Austritt und durch Ausschluss aus dem Verein. Verpflichtungen dem Verein gegenüber sind bis zum Ablauf eines laufenden Kalenderjahres zu erfüllen. Die Austrittserklärung ist schriftlich an den Vorstand zu richten. Der Austritt ist nur zum Schluss eines Kalenderjahres unter Einhaltung einer Frist von sechs Wochen zulässig.",
      "Ein Mitglied kann, nach vorheriger Anhörung, vom Vorstand aus dem Verein ausgeschlossen werden:",
      {
        liste: [
          "wegen Nichterfüllung satzungsgemäßer Verpflichtungen und Nichtbefolgung von Anordnungen der Vereinsleitung,",
          "wegen Nichtzahlung des Mitgliedsbeitrages eines Kalenderjahres trotz zweimaliger schriftlicher Aufforderung,",
          "wegen eines schweren Verstoßes gegen die Interessen des Vereins und unsportlichen Verhaltens,",
          "wegen unehrenhafter Handlungen.",
        ],
      },
      "Der Beschluss des Vorstandes ist dem Mitglied schriftlich mit Gründen mitzuteilen. Dieses kann innerhalb von einer Frist von zwei Wochen Beschwerde gegen den Vereinsausschluss beim Vereinsvorstand einlegen. Über die Beschwerde entscheidet eine zeitnah einzuberufende Mitgliederversammlung mit Zwei-Drittel-Mehrheit.",
    ],
  },
  {
    titel: "§ 4 – Mitgliedsbeitrag",
    absaetze: [
      "Der jährliche Mitgliedsbeitrag wird jeweils von der Mitgliedsversammlung im Voraus bestimmt. Auch kann die Mitgliedsversammlung im Bedarfsfalle die Erhebung eines außerordentlichen Betrages mit einfacher Stimmenmehrheit beschließen.",
      "Die Mitglieder erhalten keine Gewinnanteile und in ihrer Eigenschaft als Mitglieder auch keine sonstigen Zuwendungen aus Mitteln des Vereins.",
    ],
  },
  {
    titel: "§ 5 – Haftung",
    absaetze: [
      "Die Haftung des Vereins gegenüber seinen Mitgliedern ist ausgeschlossen für nicht vom Verein zu vertretende Unfälle und Straftaten, wie beispielsweise Diebstähle in den Sportstätten.",
    ],
  },
  {
    titel: "§ 6 – Organe des Vereins",
    absaetze: [
      "Organe des Vereins sind:",
      { liste: ["die Mitgliederversammlung,", "der Vereinsvorstand."] },
    ],
  },
  {
    titel: "§ 7 – Mitgliederversammlung",
    absaetze: [
      "Oberstes Organ ist die Mitgliederversammlung. Die Einberufung durch den Vorstand erfolgt durch Öffentlche Bekanntgabe in dem hiesigen Amtsblatt und durch Veröffentlichung auf der Vereinshomepage www.sv-fisch.de. Zwischen dem Tage der Einladung und dem Termin der Versammlung soll eine Frist von mindestens 14 Tagen liegen.",
      "Die Mitgliederversammlung entscheidet immer mit Stimmenmehrheit. Bei Stimmengleichheit wird die Wahl wiederholt bis sich eine Stimmenmehrheit ergibt. Bei Satzungsänderungen oder über Anträge zum Ausschluss aus dem Verein oder eine Beschwerde gegen einen Vereinsausschluss entscheidet die Mitgliederversammlung mit Zweidrittel-Mehrheit der erschienenen stimmberechtigten Mitglieder.",
      "Die Mitgliederversammlung ist ohne Rücksicht auf die Zahl der erschienenen Mitglieder beschlussfähig. In ihr kann über Anträge nur abgestimmt werden, die mindestens zwei Tage vorher schriftlich dem Vereinsvorstand vorgelegen haben. Es sei denn, dass die Mitgliederversammlung die Dringlichkeit des Antrages mit Zweidrittel-Mehrheit anerkennt.",
      "Falls ein anwesendes Mitglied geheime Abstimmung wünscht, muss geheim abgestimmt werden. Die gefassten Beschlüsse sind zu protokollieren.",
      "Jugendliche Mitglieder haben in der Mitgliederversammlung bis zum vollendeten 18. Lebensjahr kein Stimmrecht. Zur Gewährleistung der eigenverantwortlichen Tätigkeit der Vereinsjugend, zur Regelung der Wahl des Jugendleiters und zur Organisation der Jugendarbeit wird eine Jugendordnung erlassen. Diese ist Bestandteil der Vereinssatzung.",
      "Die Mitgliederversammlung findet regelmäßig mindestens einmal im Kalenderjahr statt. Regelmäßige Gegenstände der Beratung und Beschlussfassung sind:",
      {
        liste: [
          "Entgegennahme der Jahresberichte, des Kassenprüfberichtes, Entlastung des Vorstandes,",
          "Wahl des Vorstandes und der Kassenprüfer sowie der Leiter der Abteilungen, sofern dies notwendig ist,",
          "Beschlussfassung über vorliegende Anträge und Festsetzung der Mitgliederbeiträge.",
        ],
      },
      "Eine außerordentliche Mitgliederversammlung wird auf Beschluss des Vorstandes einberufen. Der Vorstand ist zur Einberufung innerhalb einer Frist von 14 Tagen verpflichtet, wenn wenigstens ein Viertel der stimmberechtigten Mitglieder dieses schriftlich beantragt hat.",
    ],
  },
  {
    titel: "§ 8 – Vereinsvorstand",
    absaetze: [
      "Der Vereinsvorstand setzt sich zusammen aus dem geschäftsführenden Vorstand nach § 26 BGB (mindestens 2, maximal 4 Personen, sowie Schatzmeister) und dem Gesamtvorstand (geschäftsführender Vorstand, den Abteilungsleitern, Schriftführer und den Beisitzern)",
      "Die Zahl der Beisitzer richtet sich nach den jeweiligen Erfordernissen des Vorstandes.",
      "Vorstand im Sinne des § 26 BGB ist der geschäftsführende Vorstand. Dieser vertritt den Verein gerichtlich und außergerichtlich. Je 2 Mitglieder gemeinsam sind vertretungsberechtigt.",
      "Der Vereinsvorstand wird von der Mitgliederversammlung auf die Dauer von 2 Jahren gewählt. Abwesende können gewählt werden, wenn sie ihre Bereitschaft zur Annahme des Amtes zuvor schriftlich erklärt haben. Der Vorstand bleibt bis zur satzungsgemäßen Bestellung des nächsten Vereinsvorstandes im Amt. Scheidet ein Vorstandsmitglied vorzeitig aus dem Vereinsvorstand aus, so ist der Vereinsvorstand berechtigt, kommissarisch ein Vorstandsmitglied mit der Wahrnehmung der Geschäfte des betreffenden Vorstandsamtes zu beauftragen. In der zeitlich nächsten Mitgliederversammlung ist dann das Vorstandsmitglied zu bestätigen bzw. das Vorstandsamt neu zu besetzen.",
      "Dem Vereinsvorstand obliegt die Leitung des Vereins, insbesondere ist er zuständig für:",
      {
        liste: [
          "die Bewilligung der Ausgaben,",
          "die Durchführung der Beschlüsse der Mitgliederversammlungen,",
          "die Aufnahme und den Ausschluss von Mitgliedern,",
          "alle Entscheidungen, soweit die Vereinsinteressen berührt werden.",
        ],
      },
      "Der geschäftsführende Vorstand beruft und leitet die Sitzungen des Vereinsvorstandes und der Versammlungen der Mitglieder. Der Vereinsvorstand ist einzuberufen, so oft die Lage der Geschäfte dies erfordert oder ein Mitglied des Vereinsvorstandes es beantragt. Die Beschlüsse des Vorstandes sind zu protokollieren.",
      "Zur Regelung interner Zuständigkeiten, Kompetenzen und Pflichten der einzelnen Vorstandsmitglieder und der Abteilungen des Vereins kann der geschäftsführende Vorstand eine Geschäftsordnung erlassen.",
    ],
  },
  {
    titel: "§ 9 – Auflösung des Vereins",
    absaetze: [
      "Die Auflösung des Vereins kann nur in einer zu diesem Zweck einberufenen außerordentlichen Mitgliederversammlung erfolgen. Zur Auflösung ist eine Dreiviertel-Mehrheit der anwesenden stimmberechtigten Mitglieder erforderlich.",
      "Die Abstimmung über die Auflösung ist namentlich vorzunehmen.",
      "Bei Auflösung oder Aufhebung des Vereins oder bei Wegfall seines bisherigen Zwecks fällt sein Vermögen, soweit es die eingezahlten Kapitalanteile der Mitglieder und den gemeinen Wert der von den Mitgliedern geleisteten Sacheinlagen übersteigt, an die Ortsgemeinde Fisch mit der Bestimmung, dieses unmittelbar und ausschließlich zur Förderung des Sports oder der Heimatpflege zu verwenden.",
    ],
  },
];
